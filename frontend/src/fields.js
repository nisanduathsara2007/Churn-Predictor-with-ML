import {
  CalendarClock,
  Cloud,
  CreditCard,
  DollarSign,
  FileText,
  Film,
  Headphones,
  Heart,
  MonitorSmartphone,
  Phone,
  PhoneForwarded,
  Receipt,
  ShieldCheck,
  Tv,
  User,
  UserRound,
  Users,
  Wifi,
} from 'lucide-react'

const YES_NO = [
  { label: 'No', value: 'No' },
  { label: 'Yes', value: 'Yes' },
]

// Forced to "No" while the customer has no phone / internet service
const NO_PHONE_LOCK = {
  field: 'PhoneService',
  equals: 'No',
  value: 'No',
  reason: 'Set to No because there is no phone service.',
}
const NO_INTERNET_LOCK = {
  field: 'InternetService',
  equals: 'No',
  value: 'No',
  reason: 'Set to No because there is no internet service.',
}

// Form fields in display order. Values must match the API exactly (case and spacing).
export const FORM_FIELDS = [
  { name: 'gender', label: 'Gender', icon: User, type: 'select', options: ['Female', 'Male'] },
  {
    name: 'SeniorCitizen',
    label: 'Senior Citizen',
    icon: UserRound,
    type: 'toggle',
    choices: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 },
    ],
  },
  { name: 'Partner', label: 'Partner', icon: Heart, type: 'toggle', choices: YES_NO },
  { name: 'Dependents', label: 'Dependents', icon: Users, type: 'toggle', choices: YES_NO },
  { name: 'PhoneService', label: 'Phone Service', icon: Phone, type: 'toggle', choices: YES_NO },
  {
    name: 'MultipleLines',
    label: 'Multiple Lines',
    icon: PhoneForwarded,
    type: 'toggle',
    choices: YES_NO,
    lock: NO_PHONE_LOCK,
  },
  {
    name: 'InternetService',
    label: 'Internet Service',
    icon: Wifi,
    type: 'select',
    options: ['DSL', 'Fiber optic', 'No'],
  },
  {
    name: 'OnlineSecurity',
    label: 'Online Security',
    icon: ShieldCheck,
    type: 'toggle',
    choices: YES_NO,
    lock: NO_INTERNET_LOCK,
  },
  {
    name: 'OnlineBackup',
    label: 'Online Backup',
    icon: Cloud,
    type: 'toggle',
    choices: YES_NO,
    lock: NO_INTERNET_LOCK,
  },
  {
    name: 'DeviceProtection',
    label: 'Device Protection',
    icon: MonitorSmartphone,
    type: 'toggle',
    choices: YES_NO,
    lock: NO_INTERNET_LOCK,
  },
  {
    name: 'TechSupport',
    label: 'Tech Support',
    icon: Headphones,
    type: 'toggle',
    choices: YES_NO,
    lock: NO_INTERNET_LOCK,
  },
  {
    name: 'StreamingTV',
    label: 'Streaming TV',
    icon: Tv,
    type: 'toggle',
    choices: YES_NO,
    lock: NO_INTERNET_LOCK,
  },
  {
    name: 'StreamingMovies',
    label: 'Streaming Movies',
    icon: Film,
    type: 'toggle',
    choices: YES_NO,
    lock: NO_INTERNET_LOCK,
  },
  {
    name: 'Contract',
    label: 'Contract',
    icon: FileText,
    type: 'select',
    options: ['Month-to-month', 'One year', 'Two year'],
  },
  {
    name: 'PaperlessBilling',
    label: 'Paperless Billing',
    icon: Receipt,
    type: 'toggle',
    choices: YES_NO,
  },
  {
    name: 'PaymentMethod',
    label: 'Payment Method',
    icon: CreditCard,
    type: 'select',
    options: [
      'Electronic check',
      'Mailed check',
      'Bank transfer (automatic)',
      'Credit card (automatic)',
    ],
  },
  {
    name: 'tenure',
    label: 'Tenure (months)',
    shortLabel: 'Tenure',
    icon: CalendarClock,
    type: 'number',
    placeholder: 'e.g. 12',
    step: 1,
    integer: true,
  },
  {
    name: 'MonthlyCharges',
    label: 'Monthly Charges',
    icon: DollarSign,
    type: 'number',
    placeholder: 'e.g. 70.35',
    step: 0.01,
  },
]

// Placeholder text for a dropdown, e.g. "Select gender"
export function selectPrompt(field) {
  return field.placeholder ?? `Select ${field.label.toLowerCase()}`
}

export function isLocked(field, form) {
  return Boolean(field.lock) && form[field.lock.field] === field.lock.equals
}
