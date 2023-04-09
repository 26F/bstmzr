
// mathematics = new Graph("Mathematics");

// mathematics.addnode("Multiplication", ADJACENT);
// mathematics.addnode("Division", ADJACENT);
// mathematics.addnode("Subtraction", ADJACENT);
// mathematics.addnode("Addition", ADJACENT);

// console.log(mathematics.view())

// multiplication = mathematics.godown("Multiplication");

// multiplication.addnode("Prime Factorization", ADJACENT);

// multiplication.getlastaddednode().note("imagine how much money you'd make if you solved that problem");

// multiplication.addnode("Time Complexity", ADJACENT);

// console.log(multiplication.view())

// timecomplexity = multiplication.godown("Time Complexity");
// timecomplexity.addnode("Expensive", ADJACENT);
// timecomplexity.addnode("Inexpensive", ADJACENT);

// console.log(timecomplexity.view())

// expensive = timecomplexity.godown("Expensive");
// expensive.addnode("Quadratic", TO);
// expensive.addnode("Exponential", ADJACENT);

// console.log(expensive.view())

// console.log("going up")

// atroot = false;

// current = expensive;

// while (!atroot)
// {

// 	console.log(current.view());
// 	current = current.stepup();

// 	if (current == undefined)
// 	{

// 		atroot = true;

// 	}

// }


// console.log("-----------Depth First Search--------------");


// chocolate = mathematics.depth_first_search("chocolate");

// if (!chocolate)
// {

// 	console.log("no chocolate");

// }


// mathematics = new Graph("Mathematics");

// mathematics.addnode("Algebra", ADJACENT);
// mathematics.addnode("Calculus", ADJACENT);
// mathematics.addnode("Number Theory", ADJACENT);

// algebra = mathematics.godown("Algebra");
// algebra.addnode("Polynomials", ADJACENT);
// algebra.addnode("Prime Factorization", FROM);

// algebra.getlastaddednode().note("prime numbers lol");

// calculus = mathematics.godown("Calculus");
// calculus.addnode("Integration", ADJACENT);
// calculus.addnode("Differentiation", ADJACENT);

// integration = calculus.godown("Integration");
// integration.addnode("Integration By Parts", ADJACENT);

// numbertheory = mathematics.godown("Number Theory");
// numbertheory.addnode("Congruence Equation", ADJACENT);
// numbertheory.addnode("Prime Factorization", ADJACENT);

// primefactorization = numbertheory.godown("Prime Factorization");
// primefactorization.addnode("GCD", ADJACENT);

// console.log(mathematics.depth_first_search("", true));

// var movies = new Graph("Movies");

// movies.addnode("Comedy", ADJACENT);
// movies.addnode("Action", ADJACENT);
// movies.addnode("Sci-Fi", ADJACENT);

// comedy = movies.godown("Comedy");
// comedy.addnode("Me, Myself & Irene", ADJACENT);

// mymyselfandiren = comedy.godown("Me, Myself & Irene");
// mymyselfandiren.addnode("Jim Carrey", ADJACENT);

// action = movies.godown("Action");
// action.addnode("Alien", ADJACENT);
// action.addnode("Predator", ADJACENT);
// action.addnode("Terminator", ADJACENT);

// terminator = action.godown("Terminator");
// terminator.addnode("John Conner", ADJACENT);

// scifi = movies.godown("Sci-Fi");
// scifi.addnode("Event Horizon", ADJACENT);

// g0 = new Graph("0");

// for (var c = 1; c <= 8; ++c)
// {

// 	g0.addnode(c.toString(), ADJACENT);

// }

// g1 = g0.godown("1");

// for (var c = 9; c < 13; ++c)
// {

// 	g1.addnode(c.toString(), ADJACENT);

// }

// g2 = g0.godown("2");

// for (var c = 13; c < 16; ++c)
// {

// 	g2.addnode(c.toString(), ADJACENT);

// }

// g3 = g0.godown("3");

// for (var c = 16; c < 19; ++c)
// {

// 	g3.addnode(c.toString(), ADJACENT);

// }

// g6 = g0.godown("6");
// g6.addnode("19", ADJACENT);

// g19 = g6.godown("19");
// g19.addnode("20", ADJACENT);

// g20 = g19.godown("20");
// g20.addnode("21", ADJACENT);

// g21 = g20.godown("21");
// g21.addnode("22");

// testingagainstarray = g0.depth_first_search("", true);
// console.log(testingagainstarray);

