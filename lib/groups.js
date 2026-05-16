export function generateGroups(participants, groupSize = 5) {
  if (!participants.length) return [];

  const participantsByCompany = groupBy(participants, "company");
  const allGroups = [];

  Object.values(participantsByCompany).forEach((companyParticipants) => {
    allGroups.push(...generateCompanyGroups(companyParticipants, groupSize));
  });

  return allGroups;
}

function generateCompanyGroups(companyParticipants, groupSize) {
  const groupCount = getPracticalGroupCount(companyParticipants.length, groupSize);
  const targetSizes = getTargetGroupSizes(companyParticipants.length, groupCount);
  const groups = Array.from({ length: groupCount }, () => []);

  // Place the largest departments first so unavoidable duplicates are spread
  // across groups before smaller departments fill the remaining diversity gaps.
  const departmentBuckets = Object.values(groupBy(companyParticipants, "department"))
    .map((bucket) => bucket.sort(compareBySeniorityThenName))
    .sort((a, b) => b.length - a.length);

  departmentBuckets.flat().forEach((participant) => {
    const bestGroupIndex = findBestGroupIndex(groups, targetSizes, participant);
    groups[bestGroupIndex].push(participant);
  });

  return groups;
}

function getPracticalGroupCount(participantCount, groupSize) {
  if (participantCount <= 0) return 0;
  if (participantCount < 3) return 1;

  let groupCount = Math.max(1, Math.ceil(participantCount / groupSize));

  // Groups of 4, 5 or 6 are fine. If a split creates groups below 3, reduce
  // the number of groups until the result is usable for a real event.
  while (groupCount > 1 && Math.floor(participantCount / groupCount) < 3) {
    groupCount -= 1;
  }

  return groupCount;
}

function getTargetGroupSizes(participantCount, groupCount) {
  if (groupCount <= 0) return [];

  const baseSize = Math.floor(participantCount / groupCount);
  const extraParticipants = participantCount % groupCount;

  return Array.from({ length: groupCount }, (_, index) => baseSize + (index < extraParticipants ? 1 : 0));
}

function findBestGroupIndex(groups, targetSizes, participant) {
  return groups
    .map((group, index) => ({
      index,
      score: scoreGroupFit(group, targetSizes[index], participant)
    }))
    .sort((a, b) => a.score - b.score || a.index - b.index)[0].index;
}

function scoreGroupFit(group, targetSize, participant) {
  const hasSameDepartment = group.some((member) => member.department === participant.department);
  const sameSeniorityCount = group.filter((member) => member.seniority === participant.seniority).length;
  const isAtTargetSize = group.length >= targetSize;

  // Lower score wins. Department diversity matters most, then target size,
  // then seniority spread.
  return (hasSameDepartment ? 100 : 0)
    + (isAtTargetSize ? 50 : 0)
    + (group.length * 8)
    + (sameSeniorityCount * 4);
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key] || "Unknown";
    groups[value] ||= [];
    groups[value].push(item);
    return groups;
  }, {});
}

function compareBySeniorityThenName(a, b) {
  const seniorityCompare = String(a.seniority || "").localeCompare(String(b.seniority || ""));
  if (seniorityCompare !== 0) return seniorityCompare;
  return String(a.name || "").localeCompare(String(b.name || ""));
}
