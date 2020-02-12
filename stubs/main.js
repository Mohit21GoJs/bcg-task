
var initialIdeas = [{ id: faker.random.uuid(), title: "Card 1", body: "Card 1 Body", created_date: new Date()}, { id: faker.random.uuid(), title: "Card 2", body: "Card 2 Body", created_date: new Date()}];



// Get Ideas
Sandbox.define('/ideas', 'GET', function(req, res) {
    res.send(initialIdeas);
});

// New Idea
Sandbox.define('/ideas/new', 'GET', function(req, res) {
    // retrieve users or, if there are none init, to empty array
    var idea = { id: faker.random.uuid(), created_date: new Date()};
    return res.json(idea);
});

// Partial Update
Sandbox.define('/idea/{id}', 'PATCH', function(req, res) {
    return res.send(req.body);
});

// Delete Idea
Sandbox.define('/idea/{id}', 'DELETE', function(req, res) {
    return res.send({});
});