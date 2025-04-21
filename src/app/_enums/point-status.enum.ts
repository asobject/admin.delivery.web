import {CompanyPointDTO} from '../_models/pointDTO';

export enum PointStatus {
  Active = 1,
  Inactive = 2,
  TemporaryClosed = 3
}
export function getPointStatusLabel(status: PointStatus): string {
  switch (status) {
    case PointStatus.Active:
      return 'Активный';
    case PointStatus.Inactive:
      return 'Неактивный';
    case PointStatus.TemporaryClosed:
      return 'Временно закрыт';
    default:
      return 'Неизвестный статус';
  }
}
export function getPointSeverity(status: PointStatus) {
  switch (status) {
    case PointStatus.Active:
      return 'success';
    case PointStatus.TemporaryClosed:
      return 'warn';
    case PointStatus.Inactive:
      return 'danger';
    default:
      return 'danger';
  }
}

export function getPointStatusOptions(): { label: string; value: PointStatus }[] {
  return [
    { label: getPointStatusLabel(PointStatus.Active), value: PointStatus.Active },
    { label: getPointStatusLabel(PointStatus.Inactive), value: PointStatus.Inactive },
    { label: getPointStatusLabel(PointStatus.TemporaryClosed), value: PointStatus.TemporaryClosed }
  ];
}
