import type { ApiProblem } from "../contracts";

export class ApiClientError extends Error {
  readonly problem: ApiProblem;

  constructor(problem: ApiProblem) {
    super(problem.message);
    this.name = "ApiClientError";
    this.problem = problem;
  }
}
