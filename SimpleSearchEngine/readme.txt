
Matt Magurany's Simple Search Engine
====================================

This project was built using Visual Studio 2012 and tested in IIS 8 express. It is a web application build with ASP.NET MVC 4
and Razor web pages. jQuery is used for DOM manipulation. Knockout.js is used for MVVM functionality. Twitter Bootstrap is used
for UI layout.

The search function uses a search engine service, which reads an index file into memory and is queried when a search is invoked.
The search method returns results if the searched terms appear in the file and are ordered by a search rank, descending. The sum
of matches for each term in the document determines the rank of the result.

The suggest function uses the index to return the top 25 words found in all the indexed files, ordered by the number of times
the word appeared in descending order.

The index file is build using a command line tool represented by the project SimpleIndexer. It reads *.txt files from a given
directory and then reads each word in the file. The words contain references to the files they were found in and stored in an
XML file to be read by the search engine. See /SimpleSearchEngine/App_Data/Index.xsd fo the schema for the index file.

An action filter, ActionLogAttribute, is applied globally and logs the controller action parameters. It uses the .NET
diagnostics TraceSource class, which can be configured in the Web.config file. Change the 
/configuration/system.diagnostics/sharedListeners/add/@initializeData attribute to a file in a directory that the web
application has write access to.

Unit test exist for the HomeController class and tests the Index and Search methods. The HomeController class has two
dependencies, ISearchEngine and IFilePathResolver. The unit tests isolate the methods under test by replacing the
dependencies with mock implementations with the Rhino Mocks library.

Try it out!
-----------

Open the project in Visual Studio and run the project. Visit http://localhost:5711 and start searching. The search
functionality is very simple and returns paragraphs links to .txt documents. The search type
drop-down is not used.

If you would like to search more documents. Add them to the /SimpleSearchEngine/Files directory and run the indexer
command line tool to re-generate the index file.

Example:

mIndexer.exe "C:\Inetpub\wwwroot\SimpleSearchEngine\Files" "C:\Inetpub\wwwroot\SimpleSearchEngine\App_Data\Index.xml"

A Web Deploy publish profile exists and publishes the application to http://localhost/SimpleSearchEninge.