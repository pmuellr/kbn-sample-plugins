import { AlertType } from '../../../../../kibana/x-pack/plugins/alerts/server';

export const alertType: AlertType = {
  id: 'example.always-firing',
  name: 'Example alert that always fires actions when run',
  actionGroups: [{ id: 'default', name: 'default '}],
  executor,
  defaultActionGroupId: 'default',
  producer: 'builtInAlerts'
};

async function executor({ services, params, state }) {
  if (state == null) state = {};
  if (state.count == null) state.count = 0;

  const context = {
    date: new Date().toISOString(),
    count: state.count,
  };

  console.log('trying to throw an error here')
  if (state) throw new Error('wops')
  services.alertInstanceFactory('').scheduleActions('default', context);

  state.count++;
  return state;
}