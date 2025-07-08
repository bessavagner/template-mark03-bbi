import { Component } from "../engine/core.js";
import { Button } from "../components/actions.js";
import { Form } from "../components/forms.js";

import {
  LabeledInput,
  LabeledSelect,
  FieldsContainer,
} from "../components/fields.js";

import { Popup } from "../components/display.js";

import {
  FormValidator,
  PhoneValidator,
  DiaUtilValidator,
} from "../components/forms.js";
import { horarioOptions } from "./data/scheduleData.js";

export class ScheduleForm extends Form {
  /**
   * @param {string | string[] | null} classList
   * @description Cria um formulário para agendamento de treinos experimentais.
   *  - Campos: Nome, E-mail, Telefone, Data, Horário
   *  - Validação: Todos os campos são obrigatórios.
   *  - Envio: POST para "/schedule-trial" com JSON contendo os dados
   *  - Resposta: Espera um JSON com uma chave "popup" para exibir um popup
   */
  constructor(classList = null) {
    super(
      classList ||
        "flex flex-col items-center w-full bg-base-300 shadow-xl rounded-xl p-8"
    );
    this.popup = new Popup();
  }
  renderContent() {
    this.addField(
      "nomeSobrenome",
      LabeledInput,
      {
        classList: "flex flex-col w-full",
        inputClassList: "input w-full",
        labelClassList: "label ml-2",
      },
      {
        type: "text",
        name: "nomeSobrenome",
        id: "nomeSobrenome",
        required: true,
        label: {
          text: "Nome e Sobrenome",
          for: "nomeSobrenome",
        },
      }
    );
    this.addRenderedField(
      "emailTelefone",
      new FieldsContainer({
        tagName: "div",
        classList: "grid grid-cols-1 md:grid-cols-2 gap-4 w-full my-2",
      })
        .addField(
          "email",
          LabeledInput,
          {
            classList: "flex flex-col w-full",
            inputClassList: "input w-full",
            labelClassList: "label ml-2",
          },
          {
            type: "email",
            id: "email",
            required: true,
            label: {
              text: "E-mail",
              for: "email",
            },
          }
        )
        .addField(
          "telefone",
          LabeledInput,
          {
            classList: "flex flex-col w-full",
            inputClassList: "input w-full",
            labelClassList: "label ml-2",
          },
          {
            type: "tel",
            id: "telefone",
            required: true,
            label: {
              text: "Telefone",
              for: "telefone",
            },
          }
        )
        .renderContent()
    );

    // Campo: Data
    const today = new Date().toISOString().split("T")[0];
    this.addRenderedField(
      "dataHorario",
      new FieldsContainer({
        tagName: "div",
        classList: "grid grid-cols-2 gap-4 w-full my-2",
      })
        .addField(
          "data",
          LabeledInput,
          {
            classList: "flex flex-col w-full",
            inputClassList: "input w-full",
            labelClassList: "label ml-2",
          },
          {
            type: "date",
            id: "data",
            required: true,
            label: {
              text: "Data do treino",
              for: "data",
            },
            attributes: {
              min: today,
              value: today,
            },
          }
        )
        .addField(
          "horario",
          LabeledSelect,
          {
            classList: "flex flex-col w-full",
            selectClassList: "select w-full",
            labelClassList: "label ml-2",
          },
          {
            id: "horario",
            required: true,
            label: {
              text: "Horário",
              for: "horario",
            },
            options: [{ value: "-1", text: "--" }, ...horarioOptions],
          }
        )
        .renderContent()
    );
    // Botão de envio
    this.addField(
      "submitButton",
      Button,
      {
        classList:
          "btn btn-primary w-64 self-center md:self-end text-lg font-bold mt-4 shadow-neon hover:btn-success hover:shadow-neon-success",
      },
      {
        text: "Agendar",
        attributes: { type: "submit" },
      }
    );
    return super.renderContent();
  }
  getFormData() {
    const data = super.getFormData();
    console.log(data);
    return {
      nome_sobrenome: data.nomeSobrenome,
      email: data["emailTelefone.email"],
      telefone: data["emailTelefone.telefone"],
      data: data["dataHorario.data"],
      horario: data["dataHorario.horario"],
    };
  }
  async handleSubmit(event) {
    event.preventDefault();
    if (!this.validate()) return;

    const data = this.getFormData();
    this.submitButton?.disable();

    try {
      const response = await fetch("/schedule-trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Resposta do servidor:", result);
      if (result?.popup) {
        this.popup.show(result.popup);
      } else {
        this.popup.show({
          title: "Erro inesperado",
          message: "Não foi possível processar a resposta do servidor.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      this.popup.show({
        title: "Erro de conexão",
        message: "Verifique sua internet ou tente novamente mais tarde.",
        type: "error",
      });
    } finally {
      this.submitButton?.enable();
    }
  }

  /** @returns {boolean} se o formulário é válido */
  validate() {
    const validator = new FormValidator(this, {
      nomeSobrenome: { required: true, message: "Informe seu nome completo" },
      "emailTelefone.email": {
        required: true,
        message: "E-mail obrigatório",
        validate: (v) => v.includes("@"),
        error: "Formato inválido",
      },
      "emailTelefone.telefone": {
        required: true,
        message: "Telefone obrigatório",
        validate: PhoneValidator.isValid,
        error: "Número inválido",
      },
      "dataHorario.data": {
        required: true,
        message: "Escolha uma data",
        validate: DiaUtilValidator.isValid,
        error: "Escolha dias de segunda a sexta-feira",
      },
      "dataHorario.horario": {
        required: true,
        validate: HorarioValidator.isValid,
        error: "Escolha um horário válido",
      },
    });

    return validator.validate();
  }
}

export class ScheduleFormApp extends Component {
  constructor() {
    super(
      "div",
      "flex flex-col items-center container mx-auto px-4 py-8 w-11/12 md:w-1/2 h-full"
    );
    this.form = new ScheduleForm();
  }
  renderContent() {
    this.form.renderContent();
  }
  init(target) {
    this.render({ target });
    this.renderContent();
    this.form.render({ target: this.element });
    this.form.init();
  }
}

export class HorarioValidator {
  /**
   * Verifica se o horário está presente nos valores permitidos.
   * @param {string} value
   * @returns {boolean}
   */
  static isValid(value, valid) {
    return horarioOptions.some((opt) => opt.value === value);
  }

  /**
   * Retorna lista de horários válidos (apenas os valores).
   * @returns {string[]}
   */
  static getValidHorarios() {
    return horarioOptions.map((opt) => opt.value);
  }
}
