export interface IUseFetchReposInput {
  per_page: number;
  page: number;
  nick: string;
}

export type TUseFetchReposOutput = DefinedUseQueryResult<
  IPreProcessedSingleRepo[] | undefined,
  unknown
>;

export type TUseFetchRepos = (
  input: IUseFetchReposInput
) => TUseFetchReposOutput;
