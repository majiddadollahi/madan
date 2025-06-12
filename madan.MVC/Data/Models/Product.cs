namespace madan.MVC.Data.Models;

public class Product : Entity
{
    public required string Title { set; get; }
    public ICollection<ProductPrice> ProductPrices { set; get; } = [];

}
