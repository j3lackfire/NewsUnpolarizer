The NodeJS app run on port 9001,
The Stanford Core NLP run on port 9000.

To start the app (at least in Duc machine)

cd C:\Users\Le Pham Minh Duc\Desktop\MasterThesis\Standford Core NLP\stanford-corenlp-full

java -mx4g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer 9000

Stanford NLP:

http://localhost:9000/

First run might take a while (like 1 minute or more for the service to load all of the annotators and models)

Subsequence run are much faster (1/2 seconds) because it has already load everything.

The service eats a lot of ram though, right now, it needs 3gb of ram.

The Regex Named Entities Recognition doesn't work. It seems, it freeze on my computer for soo long for just one simple sentence search.

----------------------

required packages:
    express - for setting up the server.
    request - to send request to the NLU server.

NodeJS

npm install

--------------------------
