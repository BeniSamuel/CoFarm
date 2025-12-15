import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import user1 from "../../assets/user1.png";
import { ChatContext } from "../../Context/ChatContext";

const ChatLeftNav = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showGroupChatModal, setShowGroupChatModal] = useState(false);
  const [selectedUsersForGroup, setSelectedUsersForGroup] = useState([]);
  const [groupName, setGroupName] = useState("");
  const usersPerPage = 10;
  const [showUsers, setShowUsers] = useState(true);
  const {
    setCurrentUser,
    setMessages,
    loggedUser,
    groups,
    addGroup,
    refreshGroups,
  } = useContext(ChatContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:4040/api/v1/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Filter out the logged-in user from the list
        const filtered = response.data.filter(
          (user) => user._id !== loggedUser._id
        );
        setUsers(filtered);
        setFilteredUsers(filtered);
      } catch (error) {
        toast.error("Failed to get users!");
      }
    };
    if (loggedUser._id) {
      fetchUsers();
    }
  }, [loggedUser._id]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
      setCurrentPage(1);
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, users]);

  // Pagination (only for users)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = showUsers
    ? filteredUsers.slice(startIndex, endIndex)
    : [];

  const handleUserClick = (user) => {
    setCurrentUser(user);
    setMessages([]); // Clear messages when a new user is selected
  };

  const handleGroupChatToggle = (userId) => {
    setSelectedUsersForGroup((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const createGroupChat = async () => {
    if (selectedUsersForGroup.length < 2) {
      toast.error("Please select at least 2 users for group chat");
      return;
    }
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:4040/api/v1/groups",
        {
          name: groupName,
          memberIds: selectedUsersForGroup,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      addGroup(response.data.group);
      refreshGroups();
      toast.success(
        `Group "${groupName}" created with ${
          selectedUsersForGroup.length + 1
        } members!`
      );
      setShowGroupChatModal(false);
      setSelectedUsersForGroup([]);
      setGroupName("");
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create group. Please try again."
      );
    }
  };

  return (
    <div className="bg-[#184B05] flex flex-col h-[100vh] w-full min-w-[200px]">
      {/* Header with Search and Create Group Button */}
      <div className="p-4 space-y-3 border-b border-[#49881F]">
        <div className="flex gap-2">
          <button
            onClick={() => setShowUsers(true)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
              showUsers
                ? "bg-[#49881F] text-white"
                : "bg-[#83DF75] text-[#184B05]"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setShowUsers(false)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
              !showUsers
                ? "bg-[#49881F] text-white"
                : "bg-[#83DF75] text-[#184B05]"
            }`}
          >
            Groups ({groups.length})
          </button>
        </div>
        {showUsers ? (
          <>
            <div className="relative">
              <input
                type="search"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#83DF75] placeholder-black placeholder:text-xs text-sm h-9 w-full pl-8 pr-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49881F] border border-[#49881F]"
              />
              <span className="absolute left-2 top-2 text-[#184B05]">🔍</span>
            </div>
            <button
              onClick={() => setShowGroupChatModal(true)}
              className="w-full bg-[#49881F] hover:bg-[#459438] text-white text-xs font-semibold py-2 rounded-lg transition-colors"
            >
              + Create Group Chat
            </button>
          </>
        ) : (
          <div className="relative">
            <input
              type="search"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1E293B] text-white placeholder-white placeholder-opacity-70 placeholder:text-xs text-sm h-9 w-full pl-8 pr-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] border border-[#1E293B]"
            />
            <span className="absolute left-2 top-2 text-white opacity-70">
              🔍
            </span>
          </div>
        )}
      </div>

      {/* User/Group List */}
      <div className="flex-1 overflow-y-auto">
        {showUsers ? (
          currentUsers.length > 0 ? (
            <>
              {currentUsers.map((user) => (
                <div
                  className="flex flex-row items-center gap-3 p-3 hover:bg-white hover:bg-opacity-10 rounded-md mx-2 my-1 transition-all duration-200 cursor-pointer"
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                >
                  <div className="relative">
                    <img
                      src={user1}
                      className="h-10 w-10 rounded-full border-2 border-[#83DF75]"
                      alt="user"
                    />
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-[#184B05] rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold truncate">
                      {user.name}
                    </div>
                    <div className="text-[#83DF75] text-xs truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-80">
              <p className="text-sm text-white">
                {searchQuery ? "No users found" : "No users available"}
              </p>
            </div>
          )
        ) : (
          // Groups List
          (() => {
            const filteredGroups = groups.filter((group) =>
              group.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return filteredGroups.length > 0 ? (
              <>
                {filteredGroups.map((group) => (
                  <div
                    className="flex flex-row items-center gap-3 p-3 hover:bg-white hover:bg-opacity-10 rounded-md mx-2 my-1 transition-all duration-200 cursor-pointer"
                    key={group._id || group.id}
                    onClick={() =>
                      handleUserClick({
                        ...group,
                        _id: group._id || group.id,
                        isGroup: true,
                      })
                    }
                  >
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full border-2 border-[#83DF75] bg-[#49881F] flex items-center justify-center text-white font-bold text-sm">
                        👥
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold truncate">
                        {group.name}
                      </div>
                      <div className="text-[#83DF75] text-xs truncate">
                        {group.members?.length || 0} members
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-80">
                <p className="text-sm text-white">
                  {searchQuery
                    ? "No groups found"
                    : "No groups yet. Create one!"}
                </p>
              </div>
            );
          })()
        )}
      </div>

      {/* Pagination (only show for users) */}
      {showUsers && totalPages > 1 && (
        <div className="p-4 border-t border-[#49881F] flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#49881F] text-white text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#459438] transition-colors"
          >
            Prev
          </button>
          <span className="text-white text-xs">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-[#49881F] text-white text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#459438] transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Group Chat Modal */}
      {showGroupChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md max-h-[80vh] overflow-y-auto shadow-2xl">
            <h2 className="text-lg font-semibold text-[#184B05] mb-4">
              Create Group Chat
            </h2>
            <input
              type="text"
              placeholder="Group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border-2 border-[#184B05] rounded-lg px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#49881F]"
            />
            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-2 hover:bg-[#eaf7e8] rounded cursor-pointer"
                  onClick={() => handleGroupChatToggle(user._id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsersForGroup.includes(user._id)}
                    onChange={() => handleGroupChatToggle(user._id)}
                    className="h-4 w-4 text-[#184B05]"
                  />
                  <img
                    src={user1}
                    className="h-8 w-8 rounded-full"
                    alt={user.name}
                  />
                  <span className="text-sm text-[#184B05]">{user.name}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={createGroupChat}
                className="flex-1 bg-[#184B05] text-white py-2 rounded-lg hover:bg-[#49881F] transition-colors text-sm font-semibold"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowGroupChatModal(false);
                  setSelectedUsersForGroup([]);
                  setGroupName("");
                }}
                className="flex-1 bg-[#83DF75] text-[#184B05] py-2 rounded-lg hover:bg-[#c2f0bb] transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLeftNav;
