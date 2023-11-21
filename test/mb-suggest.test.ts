import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import {
  querySelectorAllDeep,
  querySelectorDeep,
} from 'query-selector-shadow-dom';
import MbForm from '../src/medblocks/form/form';
import MbSuggest from '../src/medblocks/suggestionWrapper';
import '../medblocks';
import MbInput from '../src/medblocks/text/input';

describe('mb-suggest', () => {
  it('archetype level suggestion binding with replace operation', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-suggest label="Common Symptoms">
            <mb-input
              path="chief_complaints"
              label="Chief complaints"
            ></mb-input>
          </mb-suggest>
        </mb-form>
      `
    );
    form.addSuggestion({
      chief_complaints: [
        { data: 'Body ache', label: 'Body ache', id: 1, op: 'replace' },
        { data: 'Cold', label: 'Cold', id: 2, op: 'replace' },
      ],
    });
    await elementUpdated(form);
    const suggest = querySelectorDeep('mb-suggest') as MbSuggest;
    const input = querySelectorDeep('mb-input') as MbInput;
    const buttons = querySelectorAllDeep('sl-button');

    expect(suggest.suggestions).to.have.length(2);
    expect(suggest.suggestions).to.eql([
      { data: 'Body ache', label: 'Body ache', id: 1, op: 'replace' },
      { data: 'Cold', label: 'Cold', id: 2, op: 'replace' },
    ]);

    expect(buttons).to.have.length(2);
    expect(buttons[0].textContent).to.equal('Body ache');
    expect(buttons[1].textContent).to.equal('Cold');

    buttons[0].click();
    expect(input.data).to.equal('Body ache');

    buttons[1].click();
    expect(input.data).to.equal('Cold');
  });

  it('archetype level suggestion binding with add operation in simple mb-input', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-suggest label="Common Symptoms">
            <mb-input
              path="chief_complaints"
              label="Chief complaints"
            ></mb-input>
          </mb-suggest>
        </mb-form>
      `
    );
    form.addSuggestion({
      chief_complaints: [
        { data: 'Body ache', label: 'Body ache', id: 1, op: 'add' },
        { data: 'Cold', label: 'Cold', id: 2, op: 'add' },
      ],
    });
    await elementUpdated(form);
    const suggest = querySelectorDeep('mb-suggest') as MbSuggest;
    const input = querySelectorDeep('mb-input') as MbInput;
    const buttons = querySelectorAllDeep('sl-button');

    expect(suggest.suggestions).to.have.length(2);
    expect(suggest.suggestions).to.eql([
      { data: 'Body ache', label: 'Body ache', id: 1, op: 'add' },
      { data: 'Cold', label: 'Cold', id: 2, op: 'add' },
    ]);

    expect(buttons).to.have.length(2);
    expect(buttons[0].textContent).to.equal('Body ache');
    expect(buttons[1].textContent).to.equal('Cold');

    buttons[0].click();
    expect(input.data).to.eql(['Body ache']);

      buttons[1].click();
    expect(input.data).to.eql(['Body ache','Cold']);
  });
  it('archetype level suggestion binding with add operation', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-suggest label="Common Symptoms">
            <mb-input
              multiple
              path="chief_complaints"
              label="Chief complaints"
            ></mb-input>
          </mb-suggest>
        </mb-form>
      `
    );
    form.addSuggestion({
      chief_complaints: [
        { data: 'Body ache', label: 'Body ache', id: 1, op: 'add' },
        { data: 'Cold', label: 'Cold', id: 2, op: 'add' },
      ],
    });
    await elementUpdated(form);
    const suggest = querySelectorDeep('mb-suggest') as MbSuggest;
    const input = querySelectorDeep('mb-input') as MbInput;
    const buttons = querySelectorAllDeep('sl-button');

    expect(suggest.suggestions).to.have.length(2);
    expect(suggest.suggestions).to.eql([
      { data: 'Body ache', label: 'Body ache', id: 1, op: 'add' },
      { data: 'Cold', label: 'Cold', id: 2, op: 'add' },
    ]);

    expect(buttons).to.have.length(2);
    expect(buttons[0].textContent).to.equal('Body ache');
    expect(buttons[1].textContent).to.equal('Cold');
    buttons[0].click();
    expect(input.data).to.eql(['Body ache']);
    buttons[1].click();
    expect(input.data).to.eql(['Body ache', 'Cold']);
  });

  it('global suggestion binding to the form', async () => {
    const form = await fixture<MbForm>(
      `
        <mb-form>
          <mb-suggest label="Common Symptoms">
            <mb-input
              multiple
              path="chief_complaints"
              label="Chief complaints"
            ></mb-input>
          </mb-suggest>
          <mb-input
            multiple
            path="symptoms_and_signs"
            label="Symptoms and signs"
          ></mb-input>
          <mb-suggest
            global
            label="Composition Suggestions"
            path="composition_suggestion"
          ></mb-suggest>
        </mb-form>
      `
    );
    form.addSuggestion({
      chief_complaints: [
        { data: 'Body ache', label: 'Body ache', id: 1, op: 'add' },
        { data: 'Cold', label: 'Cold', id: 2, op: 'add' },
      ],
      composition_suggestion: [
        {
          data: {
            chief_complaints: ['Body ache'],
            symptoms_and_signs: ['Cold', 'Fever'],
          },
          label: 'Change composition',
          id: 2,
        },
      ],
    });
    await elementUpdated(form);
    const suggest = querySelectorAllDeep('mb-suggest') as MbSuggest[];
    const input = querySelectorDeep('mb-input') as MbInput;
    const buttons = querySelectorAllDeep('sl-button');

    expect(suggest[0].suggestions).to.have.length(2);
    expect(suggest[0].suggestions).to.eql([
      { data: 'Body ache', label: 'Body ache', id: 1, op: 'add' },
      { data: 'Cold', label: 'Cold', id: 2, op: 'add' },
    ]);

    expect(suggest[1].suggestions).to.have.length(1);
    expect(suggest[1].suggestions).to.eql([
      {
        data: {
          chief_complaints: ['Body ache'],
          symptoms_and_signs: ['Cold', 'Fever'],
        },
        label: 'Change composition',
        id: 2,
      },
    ]);

    expect(buttons).to.have.length(3);
    expect(buttons[0].textContent).to.equal('Body ache');
    expect(buttons[1].textContent).to.equal('Cold');

    buttons[0].click();
    expect(input.data).to.eql(['Body ache']);
    buttons[1].click();
    expect(input.data).to.eql(['Body ache', 'Cold']);
    buttons[2].click();
    expect(form.data).to.eql({
      chief_complaints: ['Body ache'],
      symptoms_and_signs: ['Cold', 'Fever'],
    });
  });
});
