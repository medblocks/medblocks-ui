/* eslint-disable max-classes-per-file */
import { elementUpdated } from '@open-wc/testing-helpers';
import { expect, html, fixture } from '@open-wc/testing';
import { LitElement, property, html as litHtml } from 'lit-element';
import { querySelectorDeep } from 'query-selector-shadow-dom';
import EhrElement from '../src/medblocks/EhrElement';
import '../src/medblocks/form/form';
import type MbForm from '../src/medblocks/form/form';
import MedblockForm from '../src/medblocks/form/form';
import { toFlat } from '../src/medblocks/form/plugins/openEHRFlat';

class BaseEhrElement extends EhrElement {
  @property({ type: Object }) data: any;
}

class TestComponent extends LitElement {
  @property({ type: Array }) paths: string[];

  render() {
    return litHtml`<mb-form>
      ${this.paths.map(path => litHtml`<base-ehr path=${path}></base-ehr>`)}
    </mb-form>`;
  }
}
class RepeateableTest extends LitElement {
  @property({ type: Number }) i = 2;

  render() {
    return litHtml`<mb-form>
      ${[...Array(this.i)].map(
        (_, i) => litHtml`<base-ehr path=${`path/${i}`}> </base-ehr>`
      )}
    </mb-form>`;
  }
}

class RepeateableTest2 extends LitElement {
  @property({ type: Number }) i = 2;

  render() {
    return litHtml`<mb-form>
      ${[...Array(this.i)].map(
        (_, i) => litHtml`<div>
          <base-ehr path=${`path/${i}`}> </base-ehr>
        </div>`
      )}
    </mb-form>`;
  }
}
customElements.define('repeat-element', RepeateableTest);
customElements.define('repeat-element2', RepeateableTest2);
customElements.define('base-ehr', BaseEhrElement);
customElements.define('reactive-path', TestComponent);

describe('Form', () => {
  it('should load child elements', async () => {
    const form = await fixture<MbForm>(html`
      <mb-form>
        <base-ehr path="test/path" label="Hello there"></base-ehr>
      </mb-form>
    `);
    expect(Object.keys(form.mbElements)).to.eql(['test/path']);
  });

  it('should react to change in path', async () => {
    const paths = ['hello/there', 'another/path'];
    const component = await fixture<TestComponent>(
      html`<reactive-path .paths=${paths}></reactive-path>`
    );
    const form = querySelectorDeep('mb-form') as MbForm;
    expect(Object.keys(form.mbElements)).to.eql([
      'hello/there',
      'another/path',
    ]);
    component.paths = ['test2/another', 'changed/path'];
    await elementUpdated(component);
    expect(Object.keys(form.mbElements)).to.eql([
      'test2/another',
      'changed/path',
    ]);
    component.paths = ['test2/another', 'changed/path2'];
    await elementUpdated(component);
    expect(Object.keys(form.mbElements)).to.eql([
      'test2/another',
      'changed/path2',
    ]);
  });

  it('should react to deletion in path', async () => {
    const paths = ['hello/there', 'another/path'];
    const component = await fixture<TestComponent>(
      html`<reactive-path .paths=${paths}></reactive-path>`
    );
    const form = querySelectorDeep('mb-form') as MbForm;
    expect(Object.keys(form.mbElements)).to.eql([
      'hello/there',
      'another/path',
    ]);
    component.paths = ['hello/there'];
    await elementUpdated(component);
    expect(Object.keys(form.mbElements)).to.eql(['hello/there']);
  });

  it('should remove children elements properly', async () => {
    const component = await fixture<RepeateableTest>(
      html`<repeat-element></repeat-element>`
    );
    const form = querySelectorDeep('mb-form') as MbForm;
    expect(Object.keys(form.data).length).to.eql(2);
    component.i = 1;
    await elementUpdated(component);
    expect(Object.keys(form.data).length).to.eql(1);
  });

  it('should remove children elements properly in nested div', async () => {
    const component = await fixture<RepeateableTest2>(
      html`<repeat-element2></repeat-element2>`
    );
    const form = querySelectorDeep('mb-form') as MbForm;
    expect(Object.keys(form.data).length).to.eql(2);
    component.i = 1;
    await elementUpdated(component);
    expect(Object.keys(form.data).length).to.eql(1);
  });
  it('should return correct null status', () => {
    const form = new MedblockForm();
    expect(form.hasValue(true)).eq(true);
    expect(form.hasValue([])).eq(false);
    expect(form.hasValue({})).eq(false);
    expect(form.hasValue(false)).eq(true);
    expect(form.hasValue('')).eq(false);
  });

  // test for checking if paths with value as empty string are not added
  it('should not add paths that has value as empty string to data', async () => {
    const form = await fixture<MbForm>(
      html`<mb-form>
        <base-ehr path="test/path" label="Hello there" .data=${''}></base-ehr>
        <base-ehr
          path="test/path1"
          label="Hello there"
          .data=${'hello'}
        ></base-ehr>
        <base-ehr path="" label="Hello there" .data=${'test value'}></base-ehr>
      </mb-form>`
    );
    const flat = toFlat(form.data, {});
    expect(Object.keys(form.data)).to.eql(['test/path', 'test/path1', '']);
    expect(Object.keys(flat)).to.eql(['test/path1']);
  });
});
