/**
 * Learn content for the demo. Three evergreen guides (draft previews, not yet
 * clinically reviewed) and one company update, kept apart as DESIGN.md
 * › "Learn, articles and blogs" requires. General language only: no licensed
 * instrument is named or described, no reviewer is named, and every source is
 * a real URL already cited in the repository's design documents.
 */
import type { SourceId } from './sources'

export type ArticleBlock =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'urgent'; text: string }

export interface ArticleSection {
  id: string
  heading: string
  blocks: ArticleBlock[]
}

export interface Article {
  slug: string
  title: string
  topic: string
  type: 'guide' | 'update'
  /** Short card description for lists. */
  description: string
  /** Brief summary shown first on the article page. */
  summary: string
  updated: string
  /** Prominent review label. */
  reviewLabel: string
  sections: ArticleSection[]
  glossary?: Array<{ term: string; definition: string }>
  notThis: { heading: string; text: string }
  sources: SourceId[]
  /** Shown when there are no sources, instead of an empty list. */
  sourcesNote?: string
  /** Question used for "Ask NeuroLearn about this". */
  askQuestion: string
}

export const ARTICLE_UPDATED = '20 Sep 2026'
export const DRAFT_LABEL = 'Draft preview - not yet clinically reviewed'

export const ARTICLES: Article[] = [
  {
    slug: 'preparing-for-a-memory-appointment',
    title: 'Preparing for a memory appointment',
    topic: 'Appointments',
    type: 'guide',
    description: 'What usually happens at the visit, what to bring and questions you might ask.',
    summary:
      'A memory appointment is a conversation with a clinician about changes in memory and thinking. It usually covers what has changed, general health and everyday life. Bringing notes, a list of medicines and someone who knows you well can help. This guide explains what to expect and how to prepare.',
    updated: ARTICLE_UPDATED,
    reviewLabel: DRAFT_LABEL,
    sections: [
      {
        id: 'what-it-is-for',
        heading: 'What the appointment is for',
        blocks: [
          {
            kind: 'p',
            text: 'The clinician wants to understand what has changed, when it started and how it affects everyday life. Changes in memory and thinking have many possible causes. Some, such as side effects of medicines, low vitamin levels, poor sleep, low mood or hearing difficulties, can often be addressed.',
          },
          {
            kind: 'p',
            text: 'One appointment rarely gives every answer. It is often the first step in a longer evaluation.',
          },
        ],
      },
      {
        id: 'what-usually-happens',
        heading: 'What usually happens',
        blocks: [
          { kind: 'p', text: 'Clinicians work in different ways. Your appointment may include some or all of these:' },
          {
            kind: 'ul',
            items: [
              'A conversation about the changes, in your own words.',
              'Questions for a family member or friend who knows you well, if you agree.',
              'Questions about general health, medicines, sleep and mood.',
              'A physical examination.',
              'A short assessment of memory and thinking, if the clinician thinks it will help.',
              'A discussion of next steps, which may include tests.',
            ],
          },
        ],
      },
      {
        id: 'how-to-prepare',
        heading: 'How to prepare',
        blocks: [
          {
            kind: 'ul',
            items: [
              'Write down the changes you have noticed, with examples and rough dates.',
              'List all medicines, including supplements and anything bought without a prescription.',
              'Bring glasses and hearing aids if you use them.',
              'Gather previous reports and clinic letters.',
              'Write down your questions, most important first.',
              'Ask someone who knows you well to come with you, if you would like.',
            ],
          },
        ],
      },
      {
        id: 'questions-to-ask',
        heading: 'Questions you might ask',
        blocks: [
          {
            kind: 'ul',
            items: [
              'What could be causing these changes?',
              'Do I need any tests? What will they tell us?',
              'When and how will we talk about the results?',
              'Is there anything I can do in the meantime?',
              'Who should I contact if things change?',
            ],
          },
        ],
      },
      {
        id: 'after-the-appointment',
        heading: 'After the appointment',
        blocks: [
          {
            kind: 'p',
            text: 'The clinician may request tests, suggest a follow-up visit or explain that nothing more is needed for now. Ask for the next steps in writing. If something was unclear, it is fine to ask again.',
          },
        ],
      },
      {
        id: 'when-not-to-wait',
        heading: 'When not to wait for an appointment',
        blocks: [
          {
            kind: 'urgent',
            text: 'Sudden changes are different. If someone suddenly becomes confused, has weakness on one side of the body, has trouble speaking or collapses, call 112 straight away.',
          },
        ],
      },
    ],
    glossary: [
      { term: 'Cognition', definition: 'Thinking skills, including memory, attention, language and planning.' },
      {
        term: 'Evaluation',
        definition: 'The overall process a clinician uses to understand what is causing changes. It can take more than one visit.',
      },
      { term: 'Care partner', definition: 'A family member or friend who helps, with the person’s permission.' },
    ],
    notThis: {
      heading: 'What this guide is not',
      text: 'This guide is general information. It is not medical advice and does not replace a conversation with a clinician who knows your history.',
    },
    sources: ['detecd', 'nhs-stroke'],
    askQuestion: 'What happens at a memory appointment?',
  },
  {
    slug: 'understanding-cognitive-assessments',
    title: 'Understanding cognitive assessments',
    topic: 'Assessments',
    type: 'guide',
    description: 'What an assessment looks at, what can affect it, and what a result can and cannot tell you.',
    summary:
      'A cognitive assessment is a structured set of questions and tasks that looks at memory and thinking. It gives a clinician one useful piece of information. It does not diagnose a condition on its own.',
    updated: ARTICLE_UPDATED,
    reviewLabel: DRAFT_LABEL,
    sections: [
      {
        id: 'what-it-looks-at',
        heading: 'What an assessment looks at',
        blocks: [
          { kind: 'p', text: 'Assessments look at different areas of thinking. Depending on the assessment, these may include:' },
          {
            kind: 'ul',
            items: [
              'Memory: learning new information and recalling it later.',
              'Attention: focusing and keeping track of information.',
              'Language: finding words and understanding what is said.',
              'Orientation: knowing the date, time and place.',
              'Visual and spatial skills: judging shapes, distances and directions.',
              'Planning and problem-solving, sometimes called executive function.',
            ],
          },
        ],
      },
      {
        id: 'how-they-are-given',
        heading: 'How assessments are given',
        blocks: [
          {
            kind: 'p',
            text: 'Some assessments are given in person by a clinician or a trained staff member. Others are questionnaires, or tasks completed on paper or a screen with guidance.',
          },
          {
            kind: 'p',
            text: 'Each assessment has fixed instructions, timing and scoring. That lets results be compared fairly. It is also why it matters to follow the instructions as written, without practicing beforehand or getting help with answers.',
          },
        ],
      },
      {
        id: 'what-can-affect-it',
        heading: 'What can affect how someone does',
        blocks: [
          { kind: 'p', text: 'Many everyday things can affect performance. Tell the clinician about anything that applies:' },
          {
            kind: 'ul',
            items: [
              'Poor sleep, pain, illness or tiredness.',
              'Worry or low mood.',
              'Hearing or vision difficulties.',
              'Taking the assessment in a less familiar language.',
              'Being unused to the format, such as a screen.',
            ],
          },
        ],
      },
      {
        id: 'what-a-result-means',
        heading: 'What a result can and cannot tell you',
        blocks: [
          {
            kind: 'p',
            text: 'A result can show which areas may need a closer look. It can give a starting point to compare with later, and help a clinician decide on next steps.',
          },
          {
            kind: 'p',
            text: 'A result cannot diagnose a condition by itself or predict the future. A clinician reads it together with your history, an examination and any other tests.',
          },
          {
            kind: 'p',
            text: 'If an assessment could not be completed, that is not a result. It is a reason to try another approach, such as an assisted assessment. If concerns continue even when an assessment looks as expected, it is still reasonable to talk to a clinician.',
          },
        ],
      },
      {
        id: 'family-observations',
        heading: 'Family observations are recorded separately',
        blocks: [
          {
            kind: 'p',
            text: 'A family member’s observations about everyday life are valuable. They are kept separate from the person’s own answers and never replace them.',
          },
        ],
      },
      {
        id: 'in-this-preview',
        heading: 'In this preview',
        blocks: [
          {
            kind: 'p',
            text: 'NeuroVX shows a placeholder where an authorized assessment would appear. No questions are reproduced and no score is produced.',
          },
        ],
      },
    ],
    glossary: [
      { term: 'Standardized', definition: 'Given and scored the same way every time, so results can be compared.' },
      { term: 'Executive function', definition: 'Skills for planning, organizing and solving problems.' },
      {
        term: 'Assisted assessment',
        definition: 'An assessment given with a trained person present, when doing it alone is not suitable.',
      },
    ],
    notThis: {
      heading: 'What this guide is not',
      text: 'This guide describes assessments in general. It does not describe any specific test, and it is not medical advice.',
    },
    sources: ['detecd', 'osu-self-assessment'],
    askQuestion: 'What does a cognitive assessment measure?',
  },
  {
    slug: 'supporting-someone-at-home',
    title: 'Supporting someone at home',
    topic: 'Everyday care',
    type: 'guide',
    description: 'Routines, respectful communication, safety at home and looking after yourself.',
    summary:
      'Helping someone with memory changes is often easier with steady routines, clear and respectful communication, and support for yourself. These are general ideas many families find useful. Every person and family is different.',
    updated: ARTICLE_UPDATED,
    reviewLabel: DRAFT_LABEL,
    sections: [
      {
        id: 'keep-routines-steady',
        heading: 'Keep routines steady',
        blocks: [
          {
            kind: 'ul',
            items: [
              'Keep regular times for meals, activity and sleep.',
              'Keep everyday items, such as keys and glasses, in the same place.',
              'Use a calendar or whiteboard for the day’s plan.',
              'Ask a pharmacist or clinician whether a weekly pill organizer would help.',
            ],
          },
        ],
      },
      {
        id: 'communicate-with-respect',
        heading: 'Communicate with respect',
        blocks: [
          {
            kind: 'ul',
            items: [
              'Speak to the person directly, not about them.',
              'Ask one question at a time and allow time to answer.',
              'Try not to argue about small details. Focus on how the person feels.',
              'Include them in decisions about their own care.',
            ],
          },
        ],
      },
      {
        id: 'support-independence',
        heading: 'Support independence',
        blocks: [
          {
            kind: 'p',
            text: 'Let the person do what they can, even if it takes longer. Break bigger tasks into small steps. Offer a choice between two options rather than an open question.',
          },
        ],
      },
      {
        id: 'make-home-safer',
        heading: 'Make home safer',
        blocks: [
          {
            kind: 'ul',
            items: [
              'Improve lighting, and remove loose rugs and other trip hazards.',
              'Check that the stove and gas are off after cooking.',
              'Keep important phone numbers, including 112, next to the phone.',
              'Talk with a clinician when concerns about driving, money or medicines come up.',
            ],
          },
        ],
      },
      {
        id: 'keep-short-notes',
        heading: 'Keep short notes for the care team',
        blocks: [
          {
            kind: 'p',
            text: 'Brief notes about changes, with dates and examples, help at the next visit. There is no daily task and nothing to score. Write things down only when it is useful.',
          },
        ],
      },
      {
        id: 'look-after-yourself',
        heading: 'Look after yourself too',
        blocks: [
          {
            kind: 'p',
            text: 'Caring can be tiring. Share tasks with other family members or friends, and take regular breaks. Talking with others who care for someone can help. Ask the care team whether caregiver education is available near you.',
          },
        ],
      },
      {
        id: 'plan-ahead-together',
        heading: 'Plan ahead together',
        blocks: [
          {
            kind: 'p',
            text: 'When the person is ready, talk together about what matters to them. That might include who they would like to help with money, health decisions and everyday tasks. Ask the care team which formal arrangements are available where you live.',
          },
        ],
      },
      {
        id: 'when-to-get-urgent-help',
        heading: 'When to get urgent help',
        blocks: [
          {
            kind: 'urgent',
            text: 'Call 112 if someone suddenly becomes confused, has weakness on one side of the body, has trouble speaking, has a seizure or collapses, or if you are worried they may harm themselves.',
          },
        ],
      },
    ],
    glossary: [
      { term: 'Care partner', definition: 'A family member or friend who helps, with the person’s permission.' },
      { term: 'Care team', definition: 'The clinicians and other professionals involved in someone’s care.' },
    ],
    notThis: {
      heading: 'What this guide is not',
      text: 'This guide is general information for families. It is not medical advice and does not replace advice from the person’s care team.',
    },
    sources: [],
    sourcesNote: 'Sources will be added after clinical review.',
    askQuestion: 'How can I support someone at home?',
  },
  {
    slug: 'about-this-preview',
    title: 'About this preview',
    topic: 'Company news',
    type: 'update',
    description: 'What this NeuroVX preview shows, what is not real, and how Learn content is labelled.',
    summary:
      'NeuroVX is being developed as connected care for memory and cognitive concerns. This preview shows how that could work, using one fictional care episode. It is not a clinical service, and this update is not clinical guidance.',
    updated: ARTICLE_UPDATED,
    reviewLabel: 'NeuroVX update - not clinical guidance',
    sections: [
      {
        id: 'what-you-can-explore',
        heading: 'What you can explore',
        blocks: [
          { kind: 'p', text: 'The preview follows one fictional family through a care episode:' },
          {
            kind: 'ul',
            items: [
              'A care partner shares what has changed.',
              'An assessment preview shows where authorized content would appear.',
              'A booking request goes to an illustrative clinician, who sees a visit packet with its sources.',
              'The clinician requests tests, and an illustrative lab collects a sample and releases a report.',
              'The clinician reviews the report and updates a care plan.',
            ],
          },
        ],
      },
      {
        id: 'who-it-is-for',
        heading: 'Who the preview is for',
        blocks: [
          {
            kind: 'p',
            text: 'It is for families, clinicians, laboratories and partners who want to see how connected care for memory concerns could feel. It starts with memory and cognitive care only. Other conditions are not covered.',
          },
        ],
      },
      {
        id: 'what-is-not-real',
        heading: 'What is not real',
        blocks: [
          {
            kind: 'ul',
            items: [
              'All people, clinics, labs and fees are illustrative. The names are made up, and no real organization is involved or endorses the preview.',
              'No assessment questions are included, and no scores are produced.',
              'Reports show no result values.',
              'Nothing is sent anywhere. Information stays in this browser tab and is cleared when you close it.',
            ],
          },
        ],
      },
      {
        id: 'how-learn-is-labelled',
        heading: 'How Learn content is labelled',
        blocks: [
          {
            kind: 'p',
            text: 'Guides are marked as draft previews until they have been clinically reviewed. NeuroLearn answers in this preview are pre-written, not generated. Updates like this one are company news.',
          },
        ],
      },
      {
        id: 'before-any-real-use',
        heading: 'Before any real use',
        blocks: [
          {
            kind: 'p',
            text: 'Content, workflows and safety processes need clinical, privacy, regulatory and accessibility review before NeuroVX could be used in real care. Guides would be reviewed by qualified clinicians before being published as guidance, and each would show when it was last checked.',
          },
        ],
      },
    ],
    notThis: {
      heading: 'What this update is not',
      text: 'This update is company news. It is not clinical guidance or medical advice.',
    },
    sources: [],
    sourcesNote: 'This is a company update, so it cites no clinical sources.',
    askQuestion: 'What does “not yet reviewed” mean?',
  },
]

export const GUIDES = ARTICLES.filter((a) => a.type === 'guide')
export const UPDATES = ARTICLES.filter((a) => a.type === 'update')

export function articleBySlug(slug?: string) {
  return ARTICLES.find((a) => a.slug === slug)
}

export function typeLabel(article: Article) {
  return article.type === 'guide' ? 'Guide' : 'NeuroVX update'
}

/** Every word a reader sees in the article body, for an honest reading time. */
export function wordCount(article: Article) {
  const parts: string[] = [article.title, article.summary]
  for (const s of article.sections) {
    parts.push(s.heading)
    for (const b of s.blocks) {
      if (b.kind === 'ul') parts.push(...b.items)
      else parts.push(b.text)
    }
  }
  for (const g of article.glossary ?? []) parts.push(g.term, g.definition)
  parts.push(article.notThis.heading, article.notThis.text)
  return parts.join(' ').split(/\s+/).filter(Boolean).length
}

/** Reading time calculated from the actual content: words / 200, rounded up. */
export function readingTime(article: Article) {
  return `${Math.max(1, Math.ceil(wordCount(article) / 200))} min read`
}
