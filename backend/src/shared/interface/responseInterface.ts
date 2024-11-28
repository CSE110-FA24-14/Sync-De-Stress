export interface BaseResponseInterface {
    status: String;
    message: String;
}

export interface CreateEventInterface extends BaseResponseInterface{
    status: String;
    message: String;
    id?: String;
    data?: any;
}

export interface GetEventRegisteredResponseInterface extends BaseResponseInterface{
    status: String;
    message: String;
    id?: String;
    data?: any;
}

export interface LoginResponseInterface extends BaseResponseInterface {
    email?: String;
    token?: String;
}

export interface GetEventResponseInterface extends BaseResponseInterface{
    events: {
        id: string;
        eventName: string; // Event name
        description?: string; // Optional event description
        eventDate: Date; //Event Date and Time
        location: string; // Event location
        priceEstimate?: number; // Optional price estimate
        coverPhoto?: string; // Optional cover photo (e.g., URL or binary data)
        attendee: number; // number of userRegistered
        registered: boolean;
    }[];
}

export interface RegisterEventResponseInterface extends BaseResponseInterface{
    unregistered: boolean; // true if successfully unregistered, false if successfully registed after calling this endpoint
}
