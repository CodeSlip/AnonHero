pragma solidity ^0.5.0;

contract Anon {
    struct Geolocation {
        bytes32 latitude;
        bytes32 longitude;
    }

    struct Post {
        uint256 id;
        uint256 eventId;
        string filePath;
        Geolocation location;
        uint256 timestamp;
    }

    struct Event {
        bytes32 name;
        address creator;
        Geolocation location;
        uint256[] posts;
    }

    uint256 eventId = 1;
    uint256 postId = 1;

    mapping(uint256 => Event) events;
    mapping(uint256 => Post) posts;

    function createEvent(bytes32 _latitude, bytes32 _longitude, bytes32 _name)
        public
    {
        Geolocation memory loc = Geolocation({
            latitude: _latitude,
            longitude: _longitude
        });

        Event memory newEvent = Event({
            name: _name,
            creator: msg.sender,
            location: loc,
            posts: new uint256[](0)
        });

        events[eventId++] = newEvent;
    }

    function createPost(
        bytes32 _latitude,
        bytes32 _longitude,
        uint256 _eventId,
        string memory _filePath
    ) public {
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

    function getEvent(uint256 _eventId)
        public
        returns (
            bytes32 name,
            address creator,
            bytes32 latitude,
            bytes32 longitude,
            uint256[] memory eventPosts
        )
    {
        return (
            events[_eventId].name,
            events[_eventId].creator,
            events[_eventId].location.latitude,
            events[_eventId].location.longitude,
            events[_eventId].posts
        );
    }

    function getPost(uint256 _postId)
        public
        returns (
            string memory filePath,
            bytes32 latitude,
            bytes32 longitude,
            uint256 timestamp
        )
    {
        return (
            posts[_postId].filePath,
            posts[_postId].location.latitude,
            posts[_postId].location.longitude,
            posts[_postId].timestamp
        );
    }
}
