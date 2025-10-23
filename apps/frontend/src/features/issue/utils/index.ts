export function findIssueById(issues: any[], id: number): any | null {
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
