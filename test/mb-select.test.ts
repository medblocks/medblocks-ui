import {
  html,
  fixture,
  expect,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import type { SlSelect } from '@shoelace-style/shoelace';
import type MbSelect from '../src/medblocks/codedtext/select';
import '../src/medblocks/codedtext/select';
import '../src/medblocks/codedtext/option';
import type MedblockForm from '../src/medblocks/form/form';
import '../src/medblocks/form/form';

describe('MbSelect', () => {
  it('emits data on input', async () => {
    const mbselect = await fixture<MbSelect>(
      html`<mb-select label="Hello there">
        <mb-option value="testUnit" label="Test Unit"></mb-option>
      </mb-select>`
    );
    const select = querySelectorDeep(
      'sl-select'
    ) as unknown as HTMLSelectElement;
    select.value = 'testUnit';
    select.dispatchEvent(new CustomEvent('sl-change'));
    const event: any = await oneEvent(mbselect, 'mb-input', true);
    expect(event.target.data).to.eql({
      code: 'testUnit',
      value: 'Test Unit',
      terminology: 'local',
    });
  });

  it('emits data with correct terminology', async () => {
    const mbselect = await fixture<MbSelect>(
      html`<mb-select label="Hello there" terminology="SOME-TERMINOLOGY">
        <mb-option value="testUnit" label="Test Unit"></mb-option>
      </mb-select>`
    );
    const select = querySelectorDeep(
      'sl-select'
    ) as unknown as HTMLSelectElement;
    select.value = 'testUnit';
    select.dispatchEvent(new CustomEvent('sl-change'));
    const event: any = await oneEvent(mbselect, 'mb-input', true);
    expect(event.target.data).to.eql({
      code: 'testUnit',
      value: 'Test Unit',
      terminology: 'SOME-TERMINOLOGY',
    });
  });
  it('changes input on setting data', async () => {
    const mbselect = await fixture<MbSelect>(
      html`<mb-select label="Hello there" terminology="SOME-TERMINOLOGY">
        <mb-option value="testUnit" label="Test Unit"></mb-option>
      </mb-select>`
    );
    const select = querySelectorDeep(
      'sl-select'
    ) as unknown as HTMLSelectElement;
    mbselect.data = {
      code: 'testUnit',
      value: 'Test Unit',
      terminology: 'SOME-TERMINOLOGY',
    };
    await oneEvent(mbselect, 'mb-input', true);
    await elementUpdated(mbselect);
    expect(select.value).to.eq('testUnit');
  });

  it('on multiple selection , emits correct data', async () => {
    const mbselect = await fixture<MbSelect>(
      html`
        <mb-select
          multiple
          path="mbselect:0/multiple"
          label="Hello there"
          terminology="SOME-TERMINOLOGY"
        >
          <mb-option value="testUnit" label="Test Unit"></mb-option>
          <mb-option value="testUnit2" label="Test Unit2"></mb-option>
        </mb-select>
      `
    );
    const select = querySelectorDeep('sl-select') as SlSelect;
    setTimeout(() => {
      select.value = ['testUnit', 'testUnit2'];
      select.dispatchEvent(new CustomEvent('sl-change'));
    });
    const event: any = await oneEvent(mbselect, 'mb-input', true);

    expect(event.target.data).to.eql([
      {
        code: 'testUnit',
        value: 'Test Unit',
        terminology: 'SOME-TERMINOLOGY',
      },
      {
        code: 'testUnit2',
        value: 'Test Unit2',
        terminology: 'SOME-TERMINOLOGY',
      },
    ]);
  });

  it('on multiple input , data binds correctly', async () => {
    const mbselect = await fixture<MbSelect>(
      html`
        <mb-select
          multiple
          path="mbselect:0/multiple"
          label="Hello there"
          terminology="SOME-TERMINOLOGY"
        >
          <mb-option value="testUnit" label="Test Unit"></mb-option>
          <mb-option value="testUnit2" label="Test Unit2"></mb-option>
        </mb-select>
      `
    );
    const select = querySelectorDeep('sl-select') as SlSelect;
    mbselect.data = [
      {
        code: 'testUnit',
        value: 'Test Unit',
        terminology: 'SOME-TERMINOLOGY',
      },
      {
        code: 'testUnit2',
        value: 'Test Unit2',
        terminology: 'SOME-TERMINOLOGY',
      },
    ];
    await elementUpdated(mbselect);
    expect(select.value).to.eql(['testUnit', 'testUnit2']);
  });

  it('on multiple selection with prefix and suffix , emits correct data', async () => {
    const form = await fixture<MedblockForm>(
      html`
        <mb-form>
          <mb-select
            multiple
            path="mbselect:0/multiple"
            label="Hello there"
            terminology="SOME-TERMINOLOGY"
            repeatprefix="mbselect"
            repeatsuffix="multiple"
          >
            <mb-option value="testUnit" label="Test Unit"></mb-option>
            <mb-option value="testUnit2" label="Test Unit2"></mb-option>
          </mb-select>
        </mb-form>
      `
    );
    const select = querySelectorDeep('sl-select') as SlSelect;
    setTimeout(() => {
      select.value = ['testUnit', 'testUnit2'];
      select.dispatchEvent(new CustomEvent('sl-change'));
    });
    await oneEvent(form, 'mb-input', true);
    setTimeout(() => form.handleSubmit(), 0);
    const data = await oneEvent(form, 'mb-submit', true);
    expect(data.detail).to.eql({
      'mbselect:0/multiple|code': 'testUnit',
      'mbselect:0/multiple|value': 'Test Unit',
      'mbselect:0/multiple|terminology': 'SOME-TERMINOLOGY',
      'mbselect:1/multiple|code': 'testUnit2',
      'mbselect:1/multiple|value': 'Test Unit2',
      'mbselect:1/multiple|terminology': 'SOME-TERMINOLOGY',
    });
  });

  it('on multiple selection without prefix and suffix , emits correct data', async () => {
    const form = await fixture<MedblockForm>(
      html`
        <mb-form>
          <mb-select
            multiple
            path="mbselect:0/multiple"
            label="Hello there"
            terminology="SOME-TERMINOLOGY"
          >
            <mb-option value="testUnit" label="Test Unit"></mb-option>
            <mb-option value="testUnit2" label="Test Unit2"></mb-option>
          </mb-select>
        </mb-form>
      `
    );
    const select = querySelectorDeep('sl-select') as SlSelect;
    setTimeout(() => {
      select.value = ['testUnit', 'testUnit2'];
      select.dispatchEvent(new CustomEvent('sl-change'));
    });
    await oneEvent(form, 'mb-input', true);
    setTimeout(() => form.handleSubmit(), 0);
    const data = await oneEvent(form, 'mb-submit', true);
    expect(data.detail).to.eql({
      'mbselect:0/multiple:0|code': 'testUnit',
      'mbselect:0/multiple:0|value': 'Test Unit',
      'mbselect:0/multiple:0|terminology': 'SOME-TERMINOLOGY',
      'mbselect:0/multiple:1|code': 'testUnit2',
      'mbselect:0/multiple:1|value': 'Test Unit2',
      'mbselect:0/multiple:1|terminology': 'SOME-TERMINOLOGY',
    });
  });

  it('on multiple select with prefix and suffix , binds data correctly', async () => {
    const form = await fixture<MedblockForm>(
      html`
        <mb-form>
          <mb-select
            multiple
            path="mbselect:0/multiple"
            label="Hello there"
            terminology="SOME-TERMINOLOGY"
            repeatprefix="mbselect"
            repeatsuffix="multiple"
          >
            <mb-option value="testUnit" label="Test Unit"></mb-option>
            <mb-option value="testUnit2" label="Test Unit2"></mb-option>
          </mb-select>
        </mb-form>
      `
    );
    const select = querySelectorDeep('sl-select') as SlSelect;
    const mbselect = querySelectorDeep('mb-select') as MbSelect;
    form.import({
      'mbselect:0/multiple|code': 'testUnit',
      'mbselect:0/multiple|value': 'Test Unit',
      'mbselect:0/multiple|terminology': 'SOME-TERMINOLOGY',
      'mbselect:1/multiple|code': 'testUnit2',
      'mbselect:1/multiple|value': 'Test Unit2',
      'mbselect:1/multiple|terminology': 'SOME-TERMINOLOGY',
    });
    await elementUpdated(form);
    expect(select.value).to.eql(['testUnit', 'testUnit2']);
    expect(mbselect.data).to.eql([
      {
        code: 'testUnit',
        value: 'Test Unit',
        terminology: 'SOME-TERMINOLOGY',
      },
      {
        code: 'testUnit2',
        value: 'Test Unit2',
        terminology: 'SOME-TERMINOLOGY',
      },
    ]);
  });

  it('on multiple select without prefix and suffix , binds data correctly', async () => {
    const form = await fixture<MedblockForm>(
      html`
        <mb-form>
          <mb-select
            multiple
            path="mbselect:0/multiple"
            label="Hello there"
            terminology="SOME-TERMINOLOGY"
          >
            <mb-option value="testUnit" label="Test Unit"></mb-option>
            <mb-option value="testUnit2" label="Test Unit2"></mb-option>
          </mb-select>
        </mb-form>
      `
    );
    const select = querySelectorDeep('sl-select') as SlSelect;
    const mbselect = querySelectorDeep('mb-select') as MbSelect;
    form.import({
      'mbselect:0/multiple:0|code': 'testUnit',
      'mbselect:0/multiple:0|value': 'Test Unit',
      'mbselect:0/multiple:0|terminology': 'SOME-TERMINOLOGY',
      'mbselect:0/multiple:1|code': 'testUnit2',
      'mbselect:0/multiple:1|value': 'Test Unit2',
      'mbselect:0/multiple:1|terminology': 'SOME-TERMINOLOGY',
    });
    await elementUpdated(form);
    expect(select.value).to.eql(['testUnit', 'testUnit2']);
    expect(mbselect.data).to.eql([
      {
        code: 'testUnit',
        value: 'Test Unit',
        terminology: 'SOME-TERMINOLOGY',
      },
      {
        code: 'testUnit2',
        value: 'Test Unit2',
        terminology: 'SOME-TERMINOLOGY',
      },
    ]);
  });
});
