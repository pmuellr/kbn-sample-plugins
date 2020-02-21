import { AlertType } from '../../../../../kibana/x-pack/plugins/alerting/server';

export const alertType: AlertType = {
  id: 'example.always-firing',
  name: 'Alert that always fires actions when run',
  actionGroups: [{ id: 'default', name: 'default '}],
  executor,
};

async function executor({ services, params, state }) {
  if (state == null) state = {};
  if (state.count == null) state.count = 0;

  const context = {
    date: new Date().toISOString(),
    count: state.count,
  };

  services.alertInstanceFactory('').scheduleActions('default', context);

  state.count++;
  return state;
}