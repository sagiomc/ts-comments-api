export class QueryBuilder {
  private readonly query = [];

  public match(data: object): QueryBuilder {
    return this.addStep("$match", data);
  }

  public group(data: object): QueryBuilder {
    return this.addStep("$group", data);
  }

  public sort(data: object): QueryBuilder {
    return this.addStep("$sort", data);
  }

  public unwind(data: object): QueryBuilder {
    return this.addStep("$unwind", data);
  }

  public lookup(data: object): QueryBuilder {
    return this.addStep("$lookup", data);
  }

  public project(data: object): QueryBuilder {
    return this.addStep("$project", data);
  }

  public build(): Array<object> {
    return this.query;
  }

  private addStep(step: string, data: object): QueryBuilder {
    this.query.push({
      [step]: data
    });

    return this;
  }
}
