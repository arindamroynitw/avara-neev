// Card type definitions for AI-generated responses

export const cardTypes = {
  'agent-text': {
    requiredProps: ['text'],
  },
  'metric': {
    requiredProps: ['label', 'value'],
  },
  'info-list': {
    requiredProps: ['title', 'items'],
  },
  'callout': {
    requiredProps: ['text'],
  },
  'activate-product': {
    requiredProps: ['product', 'amount', 'productName'],
  },
  'product-comparison': {
    requiredProps: ['products'],
  },
  'risk-profile': {
    requiredProps: ['product', 'maxDrawdown', 'risk'],
  },
  'projection': {
    requiredProps: ['amount', 'product', 'annual', 'monthly'],
  },
  'fund-breakdown': {
    requiredProps: ['funds'],
  },
  'allocation-donut': {
    requiredProps: ['segments'],
  },
  'sweep-recommendation': {
    requiredProps: ['sweepAmount', 'bankBalance', 'bufferAmount'],
  },
  'chip-grid': {
    requiredProps: ['chips'],
  },
  'breakdown': {
    requiredProps: ['items'],
  },
  'progress': {
    requiredProps: ['label', 'percent'],
  },
  'list': {
    requiredProps: ['items'],
  },
  'button': {
    requiredProps: ['text'],
  },
  'comparison': {
    requiredProps: ['items'],
  },
  'before-after': {
    requiredProps: ['rows'],
  },
  'highlight-number': {
    requiredProps: ['value', 'label'],
  },
  'emoji-stat': {
    requiredProps: ['items'],
  },
  'timeline': {
    requiredProps: ['events'],
  },
  'score': {
    requiredProps: ['value', 'label'],
  },
  'quick-replies': {
    requiredProps: ['suggestions'],
  },
};

export function validateCard(card) {
  if (!card || !card.type || !card.props) return false;
  const schema = cardTypes[card.type];
  if (!schema) return true; // Allow unknown types, render as text
  return schema.requiredProps.every(prop => card.props[prop] !== undefined);
}
