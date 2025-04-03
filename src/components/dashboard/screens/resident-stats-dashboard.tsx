import { getAllResidents } from '@/lib/data/data-utils';
import { Resident } from '@/lib/data/mock-data';
import { ResidentStatsPage } from './resident-stats-page';

export function ResidentStatsDashboard() {
	// Get all residents data
	const allResidents = getAllResidents();

	// Group residents into pages of 4
	const residentGroups: Resident[][] = [];
	for (let i = 0; i < allResidents.length; i += 4) {
		residentGroups.push(allResidents.slice(i, i + 4));
	}

	// Create a separate page component for each group
	// Return a fragment containing all pages which will be unpacked in the parent
	return (
		<>
			{residentGroups.map((group, index) => (
				<ResidentStatsPage
					key={`resident-page-${index}`}
					residents={group}
					pageIndex={index}
					totalPages={residentGroups.length}
				/>
			))}
		</>
	);
} 