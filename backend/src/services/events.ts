import EventModel from '../models/events';

export async function getEvents(sort: string, max?: number) {
    // Determine the sort order
    const sortOrder = sort === 'asc' ? 1 : -1;

    // Build the query with sorting
    let query = EventModel.find().sort({ eventDate: sortOrder });

    // Apply the max limit if provided
    if (max !== undefined) {
        query = query.limit(max);
    }

    // Execute the query and return the events
    const events = await query.exec();
    return events;
}
