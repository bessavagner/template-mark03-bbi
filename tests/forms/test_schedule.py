from datetime import date, timedelta

from app.forms.schedule import ScheduleForm

# Gera uma data de dia útil (segunda a sexta)
def get_valid_weekday():
    d = date.today()
    while d.weekday() >= 5:
        d += timedelta(days=1)
    return d.strftime("%Y-%m-%d")


VALID_DATA = {
    "nome_sobrenome": "João da Silva",
    "email": "joao@exemplo.com",
    "telefone": "88999999999",
    "data": get_valid_weekday(),
    "horario": "6:30",
}


def test_form_is_valid_with_correct_data():
    form = ScheduleForm(VALID_DATA)
    assert form.is_valid()
    assert form.cleaned_data["nome_sobrenome"] == "João da Silva"

def test_invalid_nome_curto():
    data = VALID_DATA.copy()
    data["nome_sobrenome"] = "Jo"
    form = ScheduleForm(data)
    assert not form.is_valid()
    assert "nome_sobrenome" in form.errors

def test_invalid_nome_com_html():
    data = VALID_DATA.copy()
    data["nome_sobrenome"] = "<script>alert(1)</script>"
    form = ScheduleForm(data)
    assert not form.is_valid()
    assert "nome_sobrenome" in form.errors

def test_invalid_email_format():
    data = VALID_DATA.copy()
    data["email"] = "invalid-email"
    form = ScheduleForm(data)
    assert not form.is_valid()
    assert "email" in form.errors

def test_invalid_telefone_letras():
    data = VALID_DATA.copy()
    data["telefone"] = "8899abc"
    form = ScheduleForm(data)
    assert not form.is_valid()
    assert "telefone" in form.errors

def test_invalid_data_fim_de_semana():
    # Garante um sábado ou domingo
    d = date.today()
    while d.weekday() < 5:
        d += timedelta(days=1)
    data = VALID_DATA.copy()
    data["data"] = d.strftime("%Y-%m-%d")

    form = ScheduleForm(data)
    assert not form.is_valid()
    assert "data" in form.errors

def test_invalid_horario_opcao_nao_existente():
    data = VALID_DATA.copy()
    data["horario"] = "10:00"
    form = ScheduleForm(data)
    assert not form.is_valid()
    assert "horario" in form.errors

def test_varios_campos_invalidos():
    data = {
        "nome_sobrenome": "X",
        "email": "x@",
        "telefone": "999",
        "data": "invalid-date",
        "horario": "00:00",
    }
    form = ScheduleForm(data)
    assert not form.is_valid()
    assert len(form.errors) == 5
