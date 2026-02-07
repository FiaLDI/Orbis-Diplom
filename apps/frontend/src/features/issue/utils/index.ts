export function findIssueById(issues: any[], id: string): any | null {
    for (const issue of issues) {
        if (issue.id === id) return issue;
        if (issue.subtasks?.length) {
            const found = findIssueById(issue.subtasks, id);
            if (found) return found;
        }
    }
    return null;
}

export function flattenIssues(issues: any[]): any[] {
    let result: any[] = [];
    for (const issue of issues) {
        result.push(issue);
        if (issue.subtasks?.length) {
            result = result.concat(flattenIssues(issue.subtasks));
        }
    }
    return result;
}

export function getContextIssues(
  issues: any[],
  focusedId: string
) {
  const all = flattenIssues(issues);
  const current = all.find(i => i.id === focusedId);

  if (!current) return null;

  const parent = current.parentId
    ? all.find(i => i.id === current.parentId)
    : null;

  const children = current.subtasks ?? [];

  const siblings = parent
    ? parent.subtasks.filter((i: any) => i.id !== focusedId)
    : all.filter(i => !i.parentId && i.id !== focusedId);

  return { parent, children, siblings };
}
