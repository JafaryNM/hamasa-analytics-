export interface FormRecord<T> {
  record: T | null;
  isCreate: boolean;
  loading: boolean;
  showModal: boolean;
}
