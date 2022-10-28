import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';
import {
  querySelectorAllDeep,
  querySelectorDeep,
} from 'query-selector-shadow-dom';
import MbInputMultiple from '../src/medblocks/text/input-multiple';
import '../src/medblocks/text/input-multiple';
import { SlInput, SlTag } from '@shoelace-style/shoelace';
import MedblockForm from '../src/medblocks/form/form';
import '../src/medblocks/form/form';
import { toInsertContext } from '../src/medblocks/form/plugins/openEHRFlat';
describe('MbInputMultiple', async () => {
  it('emits data on input', async () => {
    let mbinputmultiple = await fixture<MbInputMultiple>(
      html`<mb-input-multiple> </mb-input-multiple>`
    );
    let input = querySelectorDeep('input') as SlInput;
    setTimeout(() => {
      input.value = 'testUnit1';
      input.dispatchEvent(new Event('input'));
      mbinputmultiple.dispatchEvent(
        new KeyboardEvent('keypress', {
          key: 'Enter',
        })
      );
    });
    await oneEvent(mbinputmultiple, 'mb-input');
    await elementUpdated(mbinputmultiple);
    expect(mbinputmultiple.data).to.eql(['testUnit1']);
    setTimeout(() => {
      input.value = 'testUnit2';
      input.dispatchEvent(new Event('input'));
      mbinputmultiple.dispatchEvent(
        new KeyboardEvent('keypress', {
          key: 'Enter',
        })
      );
    });
    await oneEvent(mbinputmultiple, 'mb-input');
    await elementUpdated(mbinputmultiple);
    expect(mbinputmultiple.data).to.eql(['testUnit1', 'testUnit2']);
  });

  it('changes input on setting data', async () => {
    let mbinputmultiple = await fixture<MbInputMultiple>(
      html`<mb-input-multiple> </mb-input-multiple>`
    );
    let input = querySelectorDeep('input') as HTMLInputElement;
    mbinputmultiple.data = ['testUnit', 'testUnit1'];
    await elementUpdated(mbinputmultiple);
    let tag = querySelectorAllDeep('sl-tag') as SlTag[];
    expect(input.value).to.eql('');
    expect(tag[0].innerText).to.eql('testUnit');
  });
  it('on multiple input with prefix and suffix , emits correct data', async () => {
    const form = await fixture<MedblockForm>(
      html`
        <mb-form>
          <mb-input-multiple
            path="mbselect:0/multiple"
            label="Hello there"
            terminology="SOME-TERMINOLOGY"
            repeatprefix="mbselect"
            repeatsuffix="multiple"
          >
          </mb-input-multiple>
        </mb-form>
      `
    );
    let input = querySelectorDeep('input') as SlInput;
    const mbinputmultiple = querySelectorDeep(
      'mb-input-multiple'
    ) as MbInputMultiple;
    setTimeout(() => {
      input.value = 'testUnit1';
      input.dispatchEvent(new Event('input'));
      mbinputmultiple.dispatchEvent(
        new KeyboardEvent('keypress', {
          key: 'Enter',
        })
      );
    });
    await oneEvent(mbinputmultiple, 'mb-input');
    await elementUpdated(mbinputmultiple);
    expect(mbinputmultiple.data).to.eql(['testUnit1']);
    setTimeout(() => {
      input.value = 'testUnit2';
      input.dispatchEvent(new Event('input'));
      mbinputmultiple.dispatchEvent(
        new KeyboardEvent('keypress', {
          key: 'Enter',
        })
      );
    });
    await oneEvent(mbinputmultiple, 'mb-input');
    await elementUpdated(mbinputmultiple);
    expect(mbinputmultiple.data).to.eql(['testUnit1', 'testUnit2']);
    setTimeout(() => form.handleSubmit(), 0);
    let data = await oneEvent(form, 'mb-submit');
    expect(data.detail).to.eql({
      'mbselect:0/multiple': 'testUnit1',
      'mbselect:1/multiple': 'testUnit2',
    });
  });

  it('on multiple selection without prefix and suffix , emits correct data', async () => {
    const form = await fixture<MedblockForm>(
      html`
        <mb-form>
          <mb-input-multiple
            path="mbselect:0/multiple"
            label="Hello there"
            terminology="SOME-TERMINOLOGY"
          >
          </mb-input-multiple>
        </mb-form>
      `
    );
    let input = querySelectorDeep('input') as SlInput;
    const mbinputmultiple = querySelectorDeep(
      'mb-input-multiple'
    ) as MbInputMultiple;
    setTimeout(() => {
      input.value = 'testUnit1';
      input.dispatchEvent(new Event('input'));
      mbinputmultiple.dispatchEvent(
        new KeyboardEvent('keypress', {
          key: 'Enter',
        })
      );
    });
    await oneEvent(mbinputmultiple, 'mb-input');
    await elementUpdated(mbinputmultiple);
    expect(mbinputmultiple.data).to.eql(['testUnit1']);
    setTimeout(() => {
      input.value = 'testUnit2';
      input.dispatchEvent(new Event('input'));
      mbinputmultiple.dispatchEvent(
        new KeyboardEvent('keypress', {
          key: 'Enter',
        })
      );
    });
    await oneEvent(mbinputmultiple, 'mb-input');
    await elementUpdated(mbinputmultiple);
    expect(mbinputmultiple.data).to.eql(['testUnit1', 'testUnit2']);
    setTimeout(() => form.handleSubmit(), 0);
    let data = await oneEvent(form, 'mb-submit');
    expect(data.detail).to.eql({
      'mbselect:0/multiple:0': 'testUnit1',
      'mbselect:0/multiple:1': 'testUnit2',
    });
  });

  it('on multiple select with prefix and suffix , binds data correctly', async () => {
    const form = await fixture<MedblockForm>(
      html`
        <mb-form>
          <mb-input-multiple
            path="mbselect:0/multiple"
            label="Hello there"
            repeatprefix="mbselect"
            repeatsuffix="multiple"
          >
          </mb-input-multiple>
        </mb-form>
      `
    );
    form.import({
      'mbselect:0/multiple': 'testUnit1',
      'mbselect:1/multiple': 'testUnit2',
    });
    await elementUpdated(form);
    const inputMultiple = querySelectorDeep(
      'mb-input-multiple'
    ) as MbInputMultiple;
    expect(inputMultiple.data).to.eql(['testUnit1', 'testUnit2']);
  });

  it('on multiple select without prefix and suffix , binds data correctly', async () => {
    const form = await fixture<MedblockForm>(
      html`
        <mb-form>
          <mb-input-multiple path="mbselect:0/multiple" label="Hello there">
          </mb-input-multiple>
        </mb-form>
      `
    );
    form.import({
      'mbselect:0/multiple:0': 'testUnit1',
      'mbselect:0/multiple:1': 'testUnit2',
    });
    await elementUpdated(form);
    const inputMultiple = querySelectorDeep(
      'mb-input-multiple'
    ) as MbInputMultiple;
    expect(inputMultiple.data).to.eql(['testUnit1', 'testUnit2']);
  });
});

it.only('on multiple select with prefix and suffix , emits correct context', async () => {
  const form = await fixture<MedblockForm>(
    html`
      <mb-form>
        <mb-input-multiple
          path="mbselect/multiple:0/path"
          label="Hello there"
          repeatprefix="mbselect/multiple"
          repeatsuffix="path"
        >
        </mb-input-multiple>
        <mb-context path="mbselect/multiple:0/language" />
        <mb-context path="mbselect/multiple:1/language" />
        <mb-context path="mbselect/multiple:2/language" />
      </mb-form>
    `
  );
  let input = querySelectorDeep('input') as SlInput;
  const mbinputmultiple = querySelectorDeep(
    'mb-input-multiple'
  ) as MbInputMultiple;
  setTimeout(() => {
    input.value = 'testUnit1';
    input.dispatchEvent(new Event('input'));
    mbinputmultiple.dispatchEvent(
      new KeyboardEvent('keypress', {
        key: 'Enter',
      })
    );
  });
  await oneEvent(mbinputmultiple, 'mb-input');
  await elementUpdated(mbinputmultiple);
  expect(mbinputmultiple.data).to.eql(['testUnit1']);
  setTimeout(() => {
    input.value = 'testUnit2';
    input.dispatchEvent(new Event('input'));
    mbinputmultiple.dispatchEvent(
      new KeyboardEvent('keypress', {
        key: 'Enter',
      })
    );
  });
  await oneEvent(mbinputmultiple, 'mb-input');
  await elementUpdated(mbinputmultiple);
  expect(mbinputmultiple.data).to.eql(['testUnit1', 'testUnit2']);

  const shouldBeTrue = toInsertContext(
    'mbselect/multiple:1/language',
    form.nonEmptyPaths(),
    form.mbElements
  );

  expect(shouldBeTrue).true;
  setTimeout(() => form.handleSubmit(), 0);
  let data = await oneEvent(form, 'mb-submit');
  expect(data.detail).to.eql({
    'mbselect/multiple:0/path': 'testUnit1',
    'mbselect/multiple:1/path': 'testUnit2',
    'mbselect/multiple:0/language|code': 'en',
    'mbselect/multiple:0/language|terminology': 'ISO_639-1',
    'mbselect/multiple:1/language|code': 'en',
    'mbselect/multiple:1/language|terminology': 'ISO_639-1',
  });
});
