import { AlertType } from '../../../../../kibana/x-pack/plugins/alerts/server';

const actionGroups = ['skip', 'fizz', 'buzz', 'fizz-buzz'].map(actionGroup => {
  return { id: actionGroup, name: actionGroup }
});

export const alertType: AlertType = {
  id: 'example.fizz-buzz',
  name: 'Example alert that fires fizz, buzz, or fizz-buzz based on a counter',
  actionGroups,
  executor,
  defaultActionGroupId: 'default',
  producer: 'builtInAlerts'
};

async function executor({ services, params, state }) {
  if (state == null) throw Error('wops')
  if (state == null) state = {};
  if (state.count == null) state.count = 0;

  const fizz = state.count % 3 === 0;
  const buzz = state.count % 5 === 0;
  const fizzBuzz = fizz && buzz;

  let group: string = 'skip';

  if (fizzBuzz) {
    group = 'fizz-buzz';
  } else if (fizz) {
    group = 'fizz';
  } else if (buzz) {
    group = 'buzz';
  }

  if (group !== 'skip') {
    const context = {
      date: new Date().toISOString(),
      count: `"${state.count}"`,
    };
    services.alertInstanceFactory('').scheduleActions(group, context);
  }

  state.count++;

  return state;
}
