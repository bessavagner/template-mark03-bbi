import re
from datetime import datetime
from .constants import horarioOptions

class ValidationError(Exception):
    def __init__(self, message):
        self.message = message

class ScheduleForm:
    def __init__(self, data):
        self.data = data
        self.cleaned_data = {}
        self.errors = {}

    def is_valid(self):
        self.errors = {}
        try:
            self.cleaned_data["nome_sobrenome"] = self.clean_nome()
        except ValidationError as e:
            self.errors["nome_sobrenome"] = e.message

        try:
            self.cleaned_data["email"] = self.clean_email()
        except ValidationError as e:
            self.errors["email"] = e.message

        try:
            self.cleaned_data["telefone"] = self.clean_telefone()
        except ValidationError as e:
            self.errors["telefone"] = e.message

        try:
            self.cleaned_data["data"] = self.clean_data()
        except ValidationError as e:
            self.errors["data"] = e.message

        try:
            self.cleaned_data["horario"] = self.clean_horario()
        except ValidationError as e:
            self.errors["horario"] = e.message

        return not self.errors

    def clean_nome(self):
        nome = self.data.get("nome_sobrenome", "").strip()
        if not nome:
            raise ValidationError("Informe seu nome completo")
        nome = re.sub(r"\s+", " ", nome)  # normaliza espaços

        if not re.fullmatch(r"[A-Za-zÀ-ÖØ-öø-ÿ\s\-]{3,100}", nome):
            raise ValidationError("Nome inválido")
        return nome

    def clean_email(self):
        email = self.data.get("email", "").strip().lower()
        if not email:
            raise ValidationError("E-mail é obrigatório")

        pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.fullmatch(pattern, email):
            raise ValidationError("E-mail inválido")

        return email

    def clean_telefone(self):
        tel = re.sub(r"\D", "", self.data.get("telefone", ""))
        if len(tel) < 9 or len(tel) > 11:
            raise ValidationError("Telefone inválido")
        return tel


    def clean_data(self):
        raw = self.data.get("data")
        if not isinstance(raw, str):
            raise ValidationError("Data inválida")
        try:
            date = datetime.strptime(raw.strip(), "%Y-%m-%d")
        except Exception as err:
            raise ValidationError("Data inválida") from err

        if date.weekday() >= 5:
            raise ValidationError("Escolha um dia útil (segunda a sexta)")
        return raw  # mantém formato original 'YYYY-MM-DD'

    def clean_horario(self):
        horario = (self.data.get("horario") or "").strip()

        # Primeiro: o valor precisa existir na lista base
        base_values = {h["value"] for h in horarioOptions}
        if horario not in base_values:
            raise ValidationError("Horário inválido")

        # Agora aplicamos a regra dinâmica baseada na data
        # Tenta usar a data já validada; se não houver, tenta parsear a crua
        date_str = self.cleaned_data.get("data") or self.data.get("data")
        try:
            dt = datetime.strptime(date_str.strip(), "%Y-%m-%d")
        except Exception:
            # Se a data não for parseável aqui, deixe o clean_data acusar o erro
            # e só rejeite horários obviamente inválidos
            return horario

        # Python: Monday=0, Tuesday=1, Thursday=3
        is_tue_or_thu = dt.weekday() in (1, 3)
        if is_tue_or_thu and horario == "5:30":
            raise ValidationError("Horário 5:30 indisponível às terças e quintas")

        return horario
