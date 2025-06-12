namespace madan.MVC.Data.Models;

public class MaterialWithdrawals : Entity
{ 
   public DateTime Date { set; get; }
   public long WithdrawerId { set; get; }
   public long ProductId { set; get; }
  public double Amount { set; get; }
}