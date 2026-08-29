const SERVICE_FIELDS = {
  civil: ['warrantyYears'],
  web: ['techStack', 'projectTimeline', 'pricingModel'],
  finance: ['loanRangeMin', 'loanRangeMax', 'interestRateInfo', 'eligibilityNotes'],
};

const PROJECT_FIELDS = {
  civil: ['location', 'clientType', 'serviceCategory', 'beforeImages', 'afterImages', 'sqftTreated'],
  web: ['liveUrl', 'techStack'],
  finance: ['outcomeMetric', 'clientIndustry'],
};

/**
 * Validates request payload for a discriminated Service or Project model.
 * Rejects with a 400 Bad Request if fields from another segment are mixed in.
 * 
 * @param {string} type - 'service' or 'project'
 * @param {string} segment - 'civil', 'web', or 'finance'
 * @param {Object} body - The request body payload to check
 */
export const validateSegmentPayload = (type, segment, body) => {
  const fieldsMap = type === 'service' ? SERVICE_FIELDS : PROJECT_FIELDS;

  if (!['civil', 'web', 'finance'].includes(segment)) {
    const error = new Error(`Invalid segment: '${segment}'`);
    error.statusCode = 400;
    throw error;
  }

  // Get all other segments
  const otherSegments = Object.keys(fieldsMap).filter((s) => s !== segment);

  // Check if any fields belonging to other segments are present in the request body
  for (const otherSeg of otherSegments) {
    const forbiddenFields = fieldsMap[otherSeg];
    for (const field of forbiddenFields) {
      if (body[field] !== undefined) {
        const error = new Error(
          `Field '${field}' is not allowed for segment '${segment}'.`
        );
        error.statusCode = 400;
        throw error;
      }
    }
  }
};
