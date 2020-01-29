defmodule RemoteRetro.GroupTest do
  use RemoteRetro.DataCase

  alias RemoteRetro.Group

  test "provides a default value for label" do
    group = %Group{}
    assert group.label == ""
  end
end
