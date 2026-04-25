export const BloqueLogin = {
  id: "login",
  label: "login",
  category: "Auth",
  attributes: { class: "fa fa-sign-in" },
  content: `
    <style>
      .btn-login {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
      }
      .btn-login:hover {
        background-color: #0056b3;
      }
    </style>

    <div style="display:inline-block;">
      <button class="btn-login">Login</button>
    </div>
  `,
};
