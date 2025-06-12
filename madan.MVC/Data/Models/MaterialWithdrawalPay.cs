namespace madan.MVC.Data.Models;

public class MaterialWithdrawalPay : Entity
{
    public long MaterialWithdrawalId { set; get; }
    public PayType Type { set; get; }
    public string? Description { set; get; }
    public decimal Amount { set; get; }

    public MaterialWithdrawal MaterialWithdrawal { set; get; }
}
