using GroceryList.Api.ErrorHandling;
using GroceryList.Api.Extensions;
using GroceryList.Api.OpenApi;
using GroceryList.Application;
using GroceryList.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddJwtAuthentication();
builder.Services.AddFrontendCors(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
    options.AddOperationTransformer<BearerSecuritySchemeTransformer>();
});

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "Grocery List API v1"));
    await app.ApplyMigrationsAsync();
}
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseCors(CorsExtensions.FrontendPolicy);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
