pragma solidity ^0.5.0;

contract Anon {
    struct Geolocation {
        bytes32 latitude;
        bytes32 longitude;
    }

    struct Post {
        uint id;
        uint eventId;
        string filePath;
        Geolocation location;
        uint timestamp;
    }

    struct Event {
        bytes32 name;
        address creator;
        Geolocation location;
        uint[] posts;
    }

    uint eventId = 1;
    uint postId = 1;

    mapping(uint => Event) events;
    mapping(uint => Post) posts;

    function createEvent(bytes32 _latitude, bytes32 _longitude, bytes32 _name) public {
        Geolocation memory loc = Geolocation({
            latitude: _latitude,
            longitude: _longitude
        });

        Event memory newEvent = Event({
            name: _name,
            creator: msg.sender,
            location: loc,
            posts: new uint[](0)
        });

        events[eventId++] = newEvent;
    }

    function createPost(bytes32 _latitude, bytes32 _longitude, uint _eventId, string memory _filePath) public {
        Geolocation memory loc = Geolocation({
            latitude: _latitude,
            longitude: _longitude
        });

        posts[postId] = Post({
            id: postId,
            eventId: _eventId,
            filePath: _filePath,
            location: loc,
            timestamp: block.timestamp
        });

        events[_eventId].posts.push(postId++);
    }
}