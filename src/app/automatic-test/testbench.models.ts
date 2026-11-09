import { TaonBaseAbstractEntity, TaonEntity } from 'taon/src';

@TaonEntity({
  className: 'TestBenchPerson',
  createTable: true,
})
export class TestBenchPerson extends TaonBaseAbstractEntity {
  name!: string;

  age!: number;

  declare friend: TestBenchPerson;

  get description(): string {
    return `${this.name} (${this.age})`;
  }
}

@TaonEntity({
  className: 'TestBenchPersonCirc',
  createTable: true,
  // TODO @LAST @UNCOMMENT - make it work!
  // defaultModelMapping: () => ({
  //   '': TestBenchPersonCirc,
  //   friend: TestBenchPersonCirc,
  // }),
})
export class TestBenchPersonCirc extends TaonBaseAbstractEntity {
  name!: string;

  age!: number;

  declare friend: TestBenchPerson;

  get description(): string {
    return `${this.name} (${this.age})`;
  }
}

@TaonEntity({
  className: 'TestBenchBook',
  createTable: true,
})
export class TestBenchBook extends TaonBaseAbstractEntity {
  title!: string;

  pages!: number;

  get description(): string {
    return `${this.title} (${this.pages} pages)`;
  }
}
