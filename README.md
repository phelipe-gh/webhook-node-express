# Webhook - Leads-delivery

Este serviço disponibiliza para applicações externa meio de integrar leads com leads-delivery

## Desenvolvimento

- package manager: yarn
- linguagem: TypeScript
- Framework: Express
- Especificação de API: OpenAPI


## API

A API foi especificada utilizando OpenAPI e Swagger.

Para validação da API este repositório inclui um script que sobe o editor em um container docker. Para rodar o editor:

```
$ chmod +x scripts/open_swagger_editor.sh
$ ./scripts/open_swagger_editor.sh
```

Este editor server apenas para efeito de validação da API, seu conteúdo deve ser copiado para o arquivo config/openapi.yml ao final da edição.
Depois de rodar o script, o Swagger Editor a rodar num container e pode ser acessado em http://localhost:8044

Para visualizar a API basta rodar o outro script
```
$ chmod +x scripts/open_swagger_ui.sh
$ ./scripts/open_swagger_ui.sh
```

Este script levanta o visualizador de API no Swagger UI e pode ser acessado em http://localhost:8045


## Implementando rotas da API

O Express é conectado a definição da API usando express-openapi-validator.

Cada rota no arquivo config/openapi.yml tem uma propriedade chamada *operationId*. É essa propriedade que vai ser chamada quando a rota em questão for requerida.

O arquivo src/api/controllers/index.ts é importado no servidor Express como api, portanto ele serve como um agregador das controllers. Cada controller que for criada deve ser incluída lá. Uma vez que isso tenha sido feito, o Express vai fazer a conexão entre a propriedade definida no openapi.yml e a implementação dela nas controllers.

### Logger

Para log usamos Winston e podemos trabalhar com os seguintes níveis de logging (definido como a variável de ambiente LOGGER_LEVEL)

- error
- warn
- info
- http
- verbose
- debug
- silly

### Testes

Para testes estamos usando jest 

```
yarn test:unit
```

### Run local
  yarn dev