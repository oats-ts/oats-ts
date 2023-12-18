import { FetchClientAdapter } from '@oats-ts/openapi-fetch-client-adapter'
import { Issue } from '@oats-ts/validators'

export class BookStoreFetchClientAdapter extends FetchClientAdapter {
  public issues: Issue[] = []
  // We are not throwing in case something goes wrong, but rather store the issues locally
  // This could be used to log issues before throwing or other custom behaviour
  protected override handleResponseIssues(issues: Issue[]): void {
    this.issues.push(...issues)
  }
}
