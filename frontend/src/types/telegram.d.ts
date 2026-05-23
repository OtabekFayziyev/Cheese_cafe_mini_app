// Telegram WebApp SDK — global window.Telegram tipi
// Manba: https://core.telegram.org/bots/webapps#initializing-mini-apps

export interface TelegramWebAppUser {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  added_to_attachment_menu?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

export interface TelegramWebAppChat {
  id: number
  type: 'group' | 'supergroup' | 'channel'
  title: string
  username?: string
  photo_url?: string
}

export interface TelegramWebAppInitData {
  query_id?: string
  user?: TelegramWebAppUser
  receiver?: TelegramWebAppUser
  chat?: TelegramWebAppChat
  chat_type?: string
  chat_instance?: string
  start_param?: string
  can_send_after?: number
  auth_date: number
  hash: string
}

export interface TelegramThemeParams {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
  header_bg_color?: string
  accent_text_color?: string
  section_bg_color?: string
  section_header_text_color?: string
  subtitle_text_color?: string
  destructive_text_color?: string
}

export type HapticImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
export type HapticNotificationType = 'error' | 'success' | 'warning'

export interface TelegramHapticFeedback {
  impactOccurred: (style: HapticImpactStyle) => void
  notificationOccurred: (type: HapticNotificationType) => void
  selectionChanged: () => void
}

export interface TelegramMainButton {
  text: string
  color: string
  textColor: string
  isVisible: boolean
  isActive: boolean
  isProgressVisible: boolean
  setText: (text: string) => TelegramMainButton
  onClick: (callback: () => void) => TelegramMainButton
  offClick: (callback: () => void) => TelegramMainButton
  show: () => TelegramMainButton
  hide: () => TelegramMainButton
  enable: () => TelegramMainButton
  disable: () => TelegramMainButton
  showProgress: (leaveActive?: boolean) => TelegramMainButton
  hideProgress: () => TelegramMainButton
  setParams: (params: {
    text?: string
    color?: string
    text_color?: string
    is_active?: boolean
    is_visible?: boolean
  }) => TelegramMainButton
}

export interface TelegramBackButton {
  isVisible: boolean
  onClick: (callback: () => void) => TelegramBackButton
  offClick: (callback: () => void) => TelegramBackButton
  show: () => TelegramBackButton
  hide: () => TelegramBackButton
}

export interface TelegramCloudStorage {
  setItem: (
    key: string,
    value: string,
    callback?: (error: string | null, success?: boolean) => void
  ) => void
  getItem: (key: string, callback: (error: string | null, value?: string) => void) => void
  getItems: (
    keys: string[],
    callback: (error: string | null, values?: Record<string, string>) => void
  ) => void
  removeItem: (
    key: string,
    callback?: (error: string | null, success?: boolean) => void
  ) => void
  removeItems: (
    keys: string[],
    callback?: (error: string | null, success?: boolean) => void
  ) => void
  getKeys: (callback: (error: string | null, keys?: string[]) => void) => void
}

export interface TelegramPopupButton {
  id?: string
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
  text?: string
}

export interface TelegramWebApp {
  initData: string
  initDataUnsafe: TelegramWebAppInitData
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: TelegramThemeParams
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean

  MainButton: TelegramMainButton
  BackButton: TelegramBackButton
  HapticFeedback: TelegramHapticFeedback
  CloudStorage: TelegramCloudStorage

  ready: () => void
  expand: () => void
  close: () => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void

  onEvent: (eventType: string, eventHandler: () => void) => void
  offEvent: (eventType: string, eventHandler: () => void) => void

  sendData: (data: string) => void
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void
  openTelegramLink: (url: string) => void
  openInvoice: (url: string, callback?: (status: string) => void) => void

  showPopup: (
    params: {
      title?: string
      message: string
      buttons?: TelegramPopupButton[]
    },
    callback?: (button_id: string) => void
  ) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void

  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void

  requestWriteAccess: (callback?: (granted: boolean) => void) => void
  requestContact: (callback?: (shared: boolean) => void) => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export {}
