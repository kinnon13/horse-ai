import type { ProviderType } from './ProviderLoginTypes'

interface ProviderInfoCardProps {
  provider: ProviderType
  onEditProfile: () => void
}

export function ProviderInfoCard({ provider, onEditProfile }: ProviderInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Provider Information</h2>
      <div className="space-y-2">
        <p><strong>Business:</strong> {provider.business_name}</p>
        <p><strong>Contact:</strong> {provider.contact_name}</p>
        <p><strong>Email:</strong> {provider.email}</p>
        <p><strong>Phone:</strong> {provider.phone}</p>
        <p><strong>Location:</strong> {provider.city}, {provider.state}</p>
      </div>
      <button
        onClick={onEditProfile}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Edit Profile
      </button>
    </div>
  )
}

export default ProviderInfoCard