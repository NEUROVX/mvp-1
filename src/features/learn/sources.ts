/**
 * Real, inspectable sources. Only URLs already cited in the repository's
 * design documents are used (DESIGN.md, docs/design/PATIENT.md,
 * docs/design/PATIENT-ONE-STEP.md). Titles describe the page; they do not
 * name licensed assessment instruments. No reviewer names are invented.
 */
export type SourceId = 'detecd' | 'nia-biomarkers' | 'bbm-guideline' | 'osu-self-assessment' | 'nhs-stroke'

export interface LearnSource {
  id: SourceId
  title: string
  publisher: string
  url: string
  checked: string
}

export const SOURCE_CHECKED = '20 Sep 2026'

export const SOURCES: Record<SourceId, LearnSource> = {
  detecd: {
    id: 'detecd',
    title: 'DETeCD-ADRD clinical practice guideline: evaluating memory and thinking concerns (for professionals)',
    publisher: 'Alzheimer’s Association',
    url: 'https://www.alz.org/alz-pro/hub/care-pathway/detecd-adrd-guidance',
    checked: SOURCE_CHECKED,
  },
  'nia-biomarkers': {
    id: 'nia-biomarkers',
    title: 'How biomarkers help diagnose dementia',
    publisher: 'National Institute on Aging (NIH)',
    url: 'https://www.nia.nih.gov/health/alzheimers-symptoms-and-diagnosis/how-biomarkers-help-diagnose-dementia',
    checked: SOURCE_CHECKED,
  },
  'bbm-guideline': {
    id: 'bbm-guideline',
    title: 'Blood-based biomarker clinical practice guideline (for professionals)',
    publisher: 'Alzheimer’s Association',
    url: 'https://www.alz.org/alz-pro/hub/care-pathway/blood-based-biomarkers-guideline',
    checked: SOURCE_CHECKED,
  },
  'osu-self-assessment': {
    id: 'osu-self-assessment',
    title: 'Information on a self-administered memory and thinking screening, and its limits',
    publisher: 'The Ohio State University Wexner Medical Center',
    url: 'https://wexnermedical.osu.edu/brain-spine-neuro/memory-disorders/sage',
    checked: SOURCE_CHECKED,
  },
  'nhs-stroke': {
    id: 'nhs-stroke',
    title: 'Stroke: symptoms and when to get urgent help',
    publisher: 'NHS (UK)',
    url: 'https://www.nhs.uk/conditions/stroke/symptoms/',
    checked: SOURCE_CHECKED,
  },
}
