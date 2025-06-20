import { Component } from "../engine/core.js";
import { Form } from "../components/forms.js";
import { scheduleFormElements } from "../components/constants.js";


class ScheduleForm extends Form {
    constructor(classList = null) {
        super( classList || "bg-base-300 shadow-lg rounded-lg p-6");
    }
}

export class ScheduleFormApp extends Component {
    constructor() {
        super("div", "container mx-auto px-4 py-8 w-10/12 h-full");
        this.form = new ScheduleForm();
    }
    renderContent(options = {}) {
        const fields = options.fields || scheduleFormElements;
        this.form.renderContent({
            fields: fields,
            id: options.id || "schedule-form",
            action: options.action || "/schedule",
            method: options.method || "POST",
            target: options.target || "_self",
        });
    }
    init(target) {
        this.render({ target });
        this.form.render({target: this.element});
        this.renderContent({
            fields: scheduleFormElements,
            id: "schedule-form",
            action: "/schedule",
            method: "POST",
            target: "_self",
        });
    }
}