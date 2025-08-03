using Bogus;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.UseEndpoints(e =>
{

    e.MapFallbackToFile("index.html");
});


app.MapGet("/api/books", ([FromQuery] string seed, [FromQuery] int page, [FromQuery] string lang, [FromQuery] double likes, [FromQuery] double reviews) =>
{
    int batchSize = 20;
    int startIndex = (page - 1) * batchSize + 1;

    var locale = lang switch
    {
        "en" => "en",
        "de" => "de",
        "ja" => "ja",
        "ru" => "ru",
        _ => "en"
    };

    var books = new List<object>();
    var combinedSeed = seed.GetHashCode() + page + likes.GetHashCode() + reviews.GetHashCode();
    var faker = new Faker(locale);
    var rand = new Random(combinedSeed);

    for (int i = 0; i < batchSize; i++)
    {
        int index = startIndex + i;

        var bookFaker = new Faker(locale)
        {
            Random = new Randomizer(combinedSeed + index)
        };

        string isbn = faker.Random.Replace("###-#-###-#####-#");
        
        string title = bookFaker.Lorem.Sentence(3);
        
        /*var word1 = bookFaker.Commerce.ProductAdjective();  
        var word2 = bookFaker.Commerce.Product();              
        string title = $"{char.ToUpper(word1[0]) + word1.Substring(1)} {word2}";*/


        string publisher = bookFaker.Company.CompanyName();
        var authors = bookFaker.Make(rand.Next(1, 3), () => bookFaker.Name.FullName());
        
        
        int reviewCount;
        if (reviews < 1)
            reviewCount = rand.NextDouble() < reviews ? 1 : 0;
        else
            reviewCount = (int)reviews + (rand.NextDouble() < (reviews % 1) ? 1 : 0);

        var reviewList = new List<object>();
        for (int r = 0; r < reviewCount; r++)
        {
            reviewList.Add(new
            {
                Reviewer = faker.Name.FullName(),
                Text = faker.Lorem.Sentence()
            });
        }

        
        int likeCount = 0;
        if (likes < 1)
            likeCount = rand.NextDouble() < likes ? 1 : 0;
        else
            likeCount = (int)likes + (rand.NextDouble() < (likes % 1) ? 1 : 0);

        books.Add(new
        {
            Index = index,
            ISBN = isbn,
            Title = title,
            Authors = authors,
            Publisher = publisher,
            Reviews = reviewList,
            Likes = likeCount,
            CoverText = title + " by " + string.Join(", ", authors)
        });
    }

    return Results.Ok(books);
});

app.Run();