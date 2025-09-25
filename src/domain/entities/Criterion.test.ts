/**
 * Test file for Criterion entity
 */

import { CriterionEntity, CriterionSchema } from './Criterion';
import { Identifier } from '../../common/value-objects/Identifier';

describe('CriterionEntity', () => {
  it('should create a criterion entity', () => {
    const schema: CriterionSchema = {
      fields: [
        { key: 'title', type: 'string', required: true },
        { key: 'description', type: 'text', required: false }
      ]
    };

    const criterion = new CriterionEntity(
      new Identifier('criterion-1'),
      'feature',
      'Feature Request',
      schema,
      new Date()
    );

    expect(criterion.id.toString()).toBe('criterion-1');
    expect(criterion.key).toBe('feature');
    expect(criterion.name).toBe('Feature Request');
    expect(criterion.schema).toBe(schema);
  });

  it('should validate data correctly', () => {
    const schema: CriterionSchema = {
      fields: [
        { key: 'title', type: 'string', required: true },
        { key: 'url', type: 'url', required: false },
        { key: 'priority', type: 'enum', required: true, values: ['low', 'medium', 'high'] }
      ]
    };

    const criterion = new CriterionEntity(
      new Identifier('criterion-1'),
      'feature',
      'Feature Request',
      schema,
      new Date()
    );

    // Valid data
    const validData = {
      title: 'New Feature',
      url: 'https://example.com',
      priority: 'high'
    };

    expect(criterion.validateData(validData)).toBe(true);

    // Invalid data - missing required field
    const invalidData1 = {
      url: 'https://example.com',
      priority: 'high'
    };

    expect(criterion.validateData(invalidData1)).toBe(false);

    // Invalid data - invalid enum value
    const invalidData2 = {
      title: 'New Feature',
      url: 'https://example.com',
      priority: 'invalid'
    };

    expect(criterion.validateData(invalidData2)).toBe(false);

    // Invalid data - invalid URL
    const invalidData3 = {
      title: 'New Feature',
      url: 'not-a-url',
      priority: 'high'
    };

    expect(criterion.validateData(invalidData3)).toBe(false);
  });
});