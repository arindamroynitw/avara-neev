"""
Tax calculations: Per-component, per-lot post-tax returns.

Key insight: The 1.25L annual LTCG exemption is shared across ALL equity
components per person. This module correctly allocates the exemption pool.
"""

from .config import TAX


def calculate_lot_tax(lot_detail, is_equity=True):
    """Calculate tax on a single lot's gain.

    lot_detail: dict with 'gain', 'holding_days' keys.
    Returns (tax_amount, classification) where classification is
    'stcg', 'ltcg', or 'debt_slab'.
    """
    gain = lot_detail.get("gain", 0)
    if gain <= 0:
        return 0.0, "no_gain"

    holding_days = lot_detail.get("holding_days", 0)

    if is_equity:
        if holding_days < 365:
            return gain * TAX["equity_stcg"], "stcg"
        else:
            # LTCG — exemption handled at portfolio level
            return gain * TAX["equity_ltcg"], "ltcg_before_exemption"
    else:
        # Debt/liquid: always slab rate
        return gain * TAX["debt_slab"], "debt_slab"


def calculate_portfolio_tax(components):
    """Calculate post-tax value for a full portfolio.

    components: list of dicts, each with:
        - 'name': component identifier
        - 'lot_details': list of lot dicts (from LotTracker.lot_details_for_tax)
        - 'is_equity': bool (True for arb/equity, False for liquid/debt)

    Returns dict with per-component and total tax info, correctly sharing
    the 1.25L LTCG exemption across all equity components.
    """
    exemption_remaining = TAX["equity_ltcg_exemption"]
    total_pre_tax_gain = 0.0
    total_tax = 0.0
    component_results = []

    # First pass: calculate STCG and debt taxes; accumulate LTCG gains
    ltcg_items = []  # (component_name, lot_idx, ltcg_gain)

    for comp in components:
        comp_tax = 0.0
        comp_gain = 0.0
        comp_ltcg = 0.0
        comp_stcg = 0.0

        for i, lot in enumerate(comp["lot_details"]):
            gain = lot.get("gain", 0)
            comp_gain += gain
            if gain <= 0:
                continue

            holding_days = lot.get("holding_days", 0)

            if comp["is_equity"]:
                if holding_days < 365:
                    tax = gain * TAX["equity_stcg"]
                    comp_tax += tax
                    comp_stcg += gain
                else:
                    # Park LTCG for exemption allocation
                    ltcg_items.append((comp["name"], i, gain))
                    comp_ltcg += gain
            else:
                tax = gain * TAX["debt_slab"]
                comp_tax += tax

        component_results.append({
            "name": comp["name"],
            "total_gain": comp_gain,
            "stcg": comp_stcg,
            "ltcg_gross": comp_ltcg,
            "non_ltcg_tax": comp_tax,
            "ltcg_tax": 0.0,
        })
        total_pre_tax_gain += comp_gain

    # Second pass: allocate LTCG exemption across all equity components (FIFO by lot age)
    # Sort by holding days descending — oldest lots use exemption first
    ltcg_items_sorted = sorted(
        ltcg_items,
        key=lambda x: next(
            lot["holding_days"]
            for comp in components if comp["name"] == x[0]
            for j, lot in enumerate(comp["lot_details"]) if j == x[1]
        ),
        reverse=True,
    )

    for comp_name, lot_idx, ltcg_gain in ltcg_items_sorted:
        exempt = min(ltcg_gain, exemption_remaining)
        taxable = ltcg_gain - exempt
        tax = taxable * TAX["equity_ltcg"]
        exemption_remaining -= exempt

        # Add to matching component result
        for cr in component_results:
            if cr["name"] == comp_name:
                cr["ltcg_tax"] += tax
                break

    for cr in component_results:
        cr["total_tax"] = cr["non_ltcg_tax"] + cr["ltcg_tax"]
        cr["post_tax_gain"] = cr["total_gain"] - cr["total_tax"]
        total_tax += cr["total_tax"]

    return {
        "components": component_results,
        "total_pre_tax_gain": total_pre_tax_gain,
        "total_tax": total_tax,
        "total_post_tax_gain": total_pre_tax_gain - total_tax,
        "ltcg_exemption_used": TAX["equity_ltcg_exemption"] - exemption_remaining,
    }


def post_tax_fd_gain(pre_tax_gain):
    """FD interest is taxed at slab rate."""
    if pre_tax_gain <= 0:
        return pre_tax_gain
    return pre_tax_gain * (1 - TAX["debt_slab"])


def post_tax_savings_gain(pre_tax_gain):
    """Savings interest: 10K exempt under 80TTA, rest at slab."""
    if pre_tax_gain <= 0:
        return pre_tax_gain
    exempt = min(pre_tax_gain, TAX["savings_interest_exempt"])
    taxable = max(0, pre_tax_gain - exempt)
    return exempt + taxable * (1 - TAX["debt_slab"])
