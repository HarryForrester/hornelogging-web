import React from 'react';
import FreeformElement from './FreeformElement';
//mport { , , createNumberFormElement, createListFormElement, createDateFormElement, createTimeFormElement, createSelectlistFormElement, createImageFormElement, createSignatureFormElement } from '../FormElements' 
import CheckboxElement from './CheckboxElement';
import NumberElement from './NumberElement';
import ListElement from './ListElement';
import DateElement from './DateElement';
import TimeElement from './TimeElement';
import SelectlistElement from './SelectlistElement';
import ImageElement from './ImageElement';
import SignatureElement from './SignatureElement';

function FormSection({ section }) {
  return (
    <div className="mb-3">
      <h4 className="section-title">{section.title}</h4>
      {section.items.map((item, index) => (
        <React.Fragment key={index}>
          {renderFormItem(item)}
        </React.Fragment>
      ))}
      <hr />
    </div>
  );
}

function renderFormItem(item) {
  switch (item.type) {
    case 'check':
      return CheckboxElement(item.value, '');
    case 'freeform':
      return FreeformElement(item.label, '');
    case 'number':
      return NumberElement(item.label, '');
    case 'list':
      return ListElement(item.label, item.value);
    case 'date':
      return DateElement(item.label, new Date());
    case 'time':
      return TimeElement(item.label, '');
    case 'selectlist':
      return SelectlistElement(item.label, item.value);
    case 'image':
      return ImageElement(item.label, '');
    case 'signature':
      return SignatureElement(item.label, '');
    default:
      return null;
  }
}

function renderForm(sections) {
  return (
    <form>
      {sections.map((section, index) => (
        <FormSection key={index} section={section} />
      ))}
    </form>
  );
}

export default function RenderForm({ form }) {
  return (
    <div>
      {renderForm(JSON.parse(form.sectionsSerialized))}
    </div>
  );
}
