namespace madan.MVC.Data.Models;

public class MaterialWithdrawal : Entity
{
    public DateTime Date { set; get; }
    public long WithdrawerId { set; get; }
    public long ProductId { set; get; }
    public double Amount { set; get; }
    public string? Description { set; get; }
    public ICollection<MaterialWithdrawalPay> MaterialWithdrawalPays { set; get; } = [];
}
