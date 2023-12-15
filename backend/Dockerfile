# 
FROM python:3.9

# Crear un entorno virtual
RUN python -m venv /opt/venv

# Activar el entorno virtual
ENV PATH="/opt/venv/bin:$PATH"

# 
WORKDIR /code

# 
COPY ./requirements.txt /code/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

#
COPY ./ /code
