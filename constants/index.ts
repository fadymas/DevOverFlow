import { SidebarLink } from '@/types'
export const themes = [
  { value: 'light', label: 'Light', icon: '/assets/icons/sun.svg' },
  { value: 'dark', label: 'Dark', icon: '/assets/icons/moon.svg' },
  { value: 'system', label: 'System', icon: '/assets/icons/computer.svg' }
]

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: '/assets/icons/home.svg',
    route: '/',
    label: 'Home'
  },
  {
    imgURL: '/assets/icons/users.svg',
    route: '/community',
    label: 'Community'
  },
  {
    imgURL: '/assets/icons/star.svg',
    route: '/collection',
    label: 'Collections'
  },
  {
    imgURL: '/assets/icons/tag.svg',
    route: '/tags',
    label: 'Tags'
  },
  {
    imgURL: '/assets/icons/question.svg',
    route: '/ask-question',
    label: 'Ask a question'
  }
]

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000
  }
}

export const HOME_QUESTIONS = [
  {
    _id: '1',
    title:
      'The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this',
    tags: [
      { _id: 't1', name: 'JavaScript' },
      { _id: 't2', name: 'React.js' },
      { _id: 't3', name: 'Invalid Fields' },
      { _id: 't4', name: 'Salesforce' }
    ],
    author: {
      _id: 'u1',
      name: 'John Doe',
      picture: '/assets/icons/avatar.svg'
    },
    upvotes: 1200,
    views: 5200,
    answers: [],
    createdAt: new Date('2023-09-01T12:00:00.000Z')
  },
  {
    _id: '2',
    title:
      'An HTML table where specific cells come from values in a Google Sheet identified by their neighboring cell',
    tags: [
      { _id: 't1', name: 'JavaScript' },
      { _id: 't2', name: 'React.js' },
      { _id: 't3', name: 'Invalid Fields' },
      { _id: 't4', name: 'Salesforce' }
    ],
    author: {
      _id: 'u1',
      name: 'John Doe',
      picture: '/assets/icons/avatar.svg'
    },
    upvotes: 1200,
    views: 5200,
    answers: [],
    createdAt: new Date('2023-09-01T12:00:00.000Z')
  },
  {
    _id: '3',
    title:
      'JavaScript validation for a form stops the form data from being submitted to mysql database',
    tags: [
      { _id: 't1', name: 'JavaScript' },
      { _id: 't2', name: 'React.js' },
      { _id: 't3', name: 'Invalid Fields' },
      { _id: 't4', name: 'Salesforce' }
    ],
    author: {
      _id: 'u1',
      name: 'John Doe',
      picture: '/assets/icons/avatar.svg'
    },
    upvotes: 1200,
    views: 531111100,
    answers: [],
    createdAt: new Date('2023-09-01T12:00:00.000Z')
  }
]
