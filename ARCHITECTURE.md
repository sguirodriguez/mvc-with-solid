# Arquitetura do Projeto - Princípios SOLID

Este projeto implementa uma API REST para gerenciamento de produtos, seguindo os princípios SOLID e Clean Architecture.

## Estrutura do Projeto

## Estrutura de Pastas
src/
├── api/ # Camada de Interface com Usuário
│ ├── express/ # Implementação Express
│ └── api.ts # Interface Api
│
├── model/ # Camada de Domínio
│ ├── entities/ # Entidades de Negócio
│ ├── repositories/ # Contratos e Implementações de Persistência
│ └── services/ # Casos de Uso
└── util/ # Utilitários


## Princípios SOLID

### S - Single Responsibility Principle
Cada classe tem uma única responsabilidade:

- `Product`: Regras de negócio do produto
- `ProductController`: Interface HTTP/REST
- `ProductsRepositoryPrisma`: Persistência no banco
- `ProductService`: Orquestração dos casos de uso

### O - Open/Closed Principle
O sistema é extensível sem modificação do código existente:

- Interface `Api` permite novas implementações além do Express
- Interface `ProductRepository` permite novos tipos de persistência

### L - Liskov Substitution Principle
As implementações podem ser substituídas por suas abstrações:

- `ProductsRepositoryPrisma` pode ser substituído por qualquer classe que implemente `ProductRepository`
- `ApiExpress` pode ser substituída por qualquer implementação de `Api`

### I - Interface Segregation Principle
Interfaces são específicas para seus clientes:

- `Api`: Métodos essenciais para um servidor HTTP
- `ProductRepository`: Métodos básicos de CRUD

### D - Dependency Inversion Principle
Módulos dependem de abstrações:

- `ProductService` depende da interface `ProductRepository`
- `ProductController` depende de abstrações de serviços

## Exemplos de Código
### S - Single Responsibility Principle
"Uma classe deve ter apenas uma razão para mudar"

Exemplos no projeto:

1. **Product (Entidade)**

```typescript
export class Product {
private constructor(readonly props: ProductProps) {}
// Responsabilidade: Regras de negócio do produto
    public buy(quantity: number) {
    if (quantity <= 0) throw new Error("Quantity must be positive");
    this.props.quantity += quantity;
    }   
    public sell(quantity: number) {
        if (quantity > this.props.quantity)
        throw new Error("Insufficient stock");
        this.props.quantity -= quantity;
    }
}
```

2. **ProductController**

```typescript
export class ProductController {
    // Responsabilidade: Interface HTTP/REST
    public async create(req: Request, res: Response) {
    const { name, price } = req.body;
    const output = await this.service.create(name, price);
    return res.status(201).json(output);
    }
}
```

3. **ProductsRepositoryPrisma**

```typescript
export class ProductsRepositoryPrisma implements ProductRepository {
    // Responsabilidade: Implementação específica para Prisma
}
```

### O - Open/Closed Principle
"Entidades de software devem estar abertas para extensão, mas fechadas para modificação"

Exemplos no projeto:

1. **Api Interface**

```typescript
export interface Api {
    // Interface base que permite extensões
    start(): Promise<void>;
    stop(): Promise<void>;
    route(path: string, handler: RequestHandler): void;
}

// Implementação Express - extensão sem modificar a interface
export class ApiExpress implements Api {
    constructor(private port: number) {}
    
    async start(): Promise<void> {
        // Implementação específica Express
    }
    
    async stop(): Promise<void> {
        // Implementação específica Express
    }
    
    route(path: string, handler: RequestHandler): void {
        // Implementação específica Express
    }
}
```

2. **ProductRepository Interface**

```typescript
export interface ProductRepository {
    // Interface base que permite diferentes implementações
    create(product: Product): Promise<void>;
    findById(id: string): Promise<Product>;
    update(product: Product): Promise<void>;
    delete(id: string): Promise<void>;
}

// Implementação Prisma - extensão sem modificar a interface
export class ProductsRepositoryPrisma implements ProductRepository {
    // Implementação específica para Prisma
}

// Implementação em Memória - nova extensão para testes
export class InMemoryProductRepository implements ProductRepository {
    // Implementação específica para testes
}
```

### L - Liskov Substitution Principle
"Se S é um subtipo de T, então objetos do tipo T podem ser substituídos por objetos do tipo S sem alterar a corretude do programa"

Em termos simples: as subclasses devem ser substituíveis por suas classes base sem quebrar o funcionamento do código.

Exemplos no projeto:

1. **Exemplo com Pássaros (Violação do LSP)**
```typescript
// ❌ Exemplo de violação do LSP
class Bird {
    fly() {
        // lógica de voo
    }
}

class Penguin extends Bird {
    fly() {
        throw new Error("Pinguins não podem voar!"); // Quebra o LSP!
    }
}

// Este código vai quebrar com Penguin
function makeBirdFly(bird: Bird) {
    bird.fly(); // Explode se for um pinguim!
}
```

2. **Exemplo com Pássaros (Respeitando LSP)**
```typescript
// ✅ Exemplo correto respeitando LSP
interface IFlyingBird {
    fly(): void;
}

interface IWalkingBird {
    walk(): void;
}

class Sparrow implements IFlyingBird, IWalkingBird {
    fly() {
        // lógica de voo do pardal
    }
    walk() {
        // lógica de caminhada do pardal
    }
}

class Penguin implements IWalkingBird {
    walk() {
        // lógica de caminhada do pinguim
    }
}

// Agora o código é seguro
function makeWalkingBirdWalk(bird: IWalkingBird) {
    bird.walk(); // Funciona com qualquer pássaro que ande
}
```

Exemplos no nosso projeto:
**Interface Api e ApiExpress**
```typescript
// Interface base
export interface Api {
    start(): Promise<void>;
    stop(): Promise<void>;
    route(path: string, handler: RequestHandler): void;
}

// Implementação com Express
export class ApiExpress implements Api {
    constructor(private port: number) {}
    
    async start(): Promise<void> {
        // Implementação específica Express
    }
    
    async stop(): Promise<void> {
        // Implementação específica Express
    }
    
    route(path: string, handler: RequestHandler): void {
        // Implementação específica Express
    }
}

// O servidor pode usar qualquer implementação de Api
class Server {
    constructor(private api: Api) {}

    async initialize() {
        await this.api.start();
        // Configurar rotas...
    }
}
```

2. **Interface ProductRepository e suas implementações**
```typescript
export interface ProductRepository {
    create(product: Product): Promise<void>;
    findById(id: string): Promise<Product>;
}

// Implementação com Prisma
export class ProductsRepositoryPrisma implements ProductRepository {
    // Implementa todos os métodos conforme contrato
}

// Implementação em memória para testes
export class InMemoryProductRepository implements ProductRepository {
    // Implementa todos os métodos conforme contrato
}
```


O princípio de Liskov nos diz que:
1. Subtipos devem respeitar os contratos da classe base
2. Não devem lançar exceções inesperadas
3. Devem manter as invariantes da classe base
4. Devem ter comportamento previsível

No nosso projeto, isso significa que:
- Todas as implementações de `ProductRepository` devem funcionar de forma intercambiável
- Controllers que herdam de `BaseController` devem manter o comportamento esperado
- Implementações de `Api` devem respeitar o contrato definido pela interface


### I - Interface Segregation Principle
"Clientes não devem ser forçados a depender de interfaces que não utilizam"

1. **Exemplo de Violação do ISP**
```typescript
// ❌ RUIM: Interface muito grande forçando implementações desnecessárias
interface UserOperations {
    createUser(user: User): Promise<void>;
    deleteUser(id: string): Promise<void>;
    sendEmail(user: User, content: string): Promise<void>;
    validatePassword(password: string): boolean;
    generateAuthToken(user: User): string;
}

// Problema: A classe UserRepository é forçada a implementar métodos que não são
// relacionados à persistência de dados
class UserRepository implements UserOperations {
    async createUser(user: User): Promise<void> {
        // OK - Faz sentido estar no repositório
    }

    async deleteUser(id: string): Promise<void> {
        // OK - Faz sentido estar no repositório
    }

    async sendEmail(user: User, content: string): Promise<void> {
        // ❌ RUIM: Repositório não deveria enviar emails!
        throw new Error("Não implementado");
    }

    validatePassword(password: string): boolean {
        // ❌ RUIM: Repositório não deveria validar senhas!
        throw new Error("Não implementado");
    }

    generateAuthToken(user: User): string {
        // ❌ RUIM: Repositório não deveria gerar tokens!
        throw new Error("Não implementado");
    }
}
```

2. **Corrigindo com ISP**
```typescript
// ✅ BOM: Interfaces separadas por responsabilidade
interface UserRepository {
    createUser(user: User): Promise<void>;
    deleteUser(id: string): Promise<void>;
}

interface EmailService {
    sendEmail(user: User, content: string): Promise<void>;
}

interface AuthService {
    validatePassword(password: string): boolean;
    generateAuthToken(user: User): string;
}

// Agora cada classe implementa apenas o que precisa
class PostgresUserRepository implements UserRepository {
    async createUser(user: User): Promise<void> {
        // Lógica de persistência
    }

    async deleteUser(id: string): Promise<void> {
        // Lógica de persistência
    }
}

class EmailNotificationService implements EmailService {
    async sendEmail(user: User, content: string): Promise<void> {
        // Lógica de envio de email
    }
}

class JWTAuthService implements AuthService {
    validatePassword(password: string): boolean {
        // Lógica de validação de senha
    }

    generateAuthToken(user: User): string {
        // Lógica de geração de token
    }
}
```

O princípio é violado quando:
1. Uma interface tem muitos métodos não relacionados
2. Classes são forçadas a implementar métodos que não usam
3. Mudanças em uma funcionalidade afetam classes que não a utilizam

O princípio é respeitado quando:
1. Interfaces são pequenas e focadas
2. Classes implementam apenas os métodos que realmente precisam
3. Mudanças em uma funcionalidade afetam apenas as classes relacionadas

Benefícios de seguir o ISP:
- Código mais organizado e coeso
- Manutenção mais fácil
- Menor acoplamento entre componentes
- Melhor testabilidade

### D - Dependency Inversion Principle
"Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações."

1. **Exemplo de Violação do DIP**
```typescript
// ❌ RUIM: Dependência direta de implementação
class ProductService {
    // Dependência direta da implementação PostgreSQL
    private repository = new PostgresProductRepository();

    async createProduct(name: string, price: number): Promise<Product> {
        // Uso direto da implementação concreta
        return this.repository.create({ name, price });
    }
}

// Classe concreta de baixo nível
class PostgresProductRepository {
    async create(data: any): Promise<Product> {
        // Lógica específica do PostgreSQL
    }
}

// Problema: Se precisarmos trocar para MongoDB, teremos que modificar o ProductService
```

2. **Aplicando DIP Corretamente**
```typescript
// ✅ BOM: Dependência de abstrações
interface ProductRepository {
    create(data: ProductData): Promise<Product>;
    findById(id: string): Promise<Product>;
}

class ProductService {
    // Depende da abstração, não da implementação
    constructor(private repository: ProductRepository) {}

    async createProduct(name: string, price: number): Promise<Product> {
        return this.repository.create({ name, price });
    }
}

// Implementações concretas dependem da abstração
class PostgresProductRepository implements ProductRepository {
    async create(data: ProductData): Promise<Product> {
        // Implementação PostgreSQL
    }

    async findById(id: string): Promise<Product> {
        // Implementação PostgreSQL
    }
}

class MongoProductRepository implements ProductRepository {
    async create(data: ProductData): Promise<Product> {
        // Implementação MongoDB
    }

    async findById(id: string): Promise<Product> {
        // Implementação MongoDB
    }
}

// Uso com injeção de dependência
const postgresRepo = new PostgresProductRepository();
const mongoRepo = new MongoProductRepository();

// Podemos facilmente trocar as implementações
const productService1 = new ProductService(postgresRepo);
const productService2 = new ProductService(mongoRepo);
```

3. **Outro Exemplo com Notificações**
```typescript
// ✅ BOM: Interface para notificações
interface NotificationService {
    send(message: string, to: string): Promise<void>;
}

// Implementações concretas
class EmailNotification implements NotificationService {
    async send(message: string, to: string): Promise<void> {
        // Enviar por email
    }
}

class SMSNotification implements NotificationService {
    async send(message: string, to: string): Promise<void> {
        // Enviar por SMS
    }
}

// Serviço de alto nível depende da abstração
class OrderService {
    constructor(private notifier: NotificationService) {}

    async createOrder(order: Order): Promise<void> {
        // Lógica de criação do pedido
        await this.notifier.send(
            `Pedido ${order.id} criado com sucesso!`,
            order.customerEmail
        );
    }
}
```

Benefícios do DIP:
1. **Flexibilidade**: Fácil trocar implementações
2. **Testabilidade**: Podemos usar mocks que implementam as interfaces
3. **Desacoplamento**: Módulos dependem de contratos, não de implementações
4. **Manutenibilidade**: Mudanças em implementações não afetam os módulos de alto nível

Aplicação no projeto:
- Serviços dependem de interfaces de repositório
- Controllers dependem de interfaces de serviço
- Implementações concretas podem ser trocadas sem afetar o resto do sistema

Dicas para aplicar DIP:
1. Crie interfaces para definir contratos
2. Use injeção de dependência
3. Dependa de abstrações, não de implementações concretas
4. Mantenha as interfaces estáveis e as implementações flexíveis