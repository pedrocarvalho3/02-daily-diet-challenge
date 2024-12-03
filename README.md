# RF (Regras Funcionais)

- [x] O usuário deve poder criar um novo usuário.
- [x] O usuário deve poder ser identificado entre as requisições.
- [x] O usuário deve poder registrar uma refeição com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta.
- [ ] O usuário deve poder editar uma refeição, podendo alterar todos os dados da mesma.
- [ ] O usuário deve poder apagar uma refeição.
- [x] O usuário deve poder listar todas as refeições que ele criou.
- [ ] O usuário deve poder visualizar uma refeição única.
- [ ] O usuário deve poder recuperar métricas relacionadas às refeições:
  - Quantidade total de refeições registradas.
  - Quantidade total de refeições dentro da dieta.
  - Quantidade total de refeições fora da dieta.
  - Melhor sequência de refeições dentro da dieta.

# RN (Regras de Negócio)

- [x] Cada refeição deve estar vinculada a um usuário.
- [x] O usuário só pode visualizar, editar e apagar as refeições que ele próprio criou.
- [x] O cálculo das métricas deve ser baseado exclusivamente nas refeições do usuário autenticado.
- [x] As refeições devem ser ordenadas pela data em listagens.
- [x] Apenas usuários autenticados podem registrar, editar, visualizar ou apagar refeições.

# Link para o Deploy

[API Deploy](#) 
